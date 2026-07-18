import { test } from 'node:test';
import assert from 'node:assert';
import { enrichWithAssociatedWords } from './associated-words-enricher.js';

test('enrichWithAssociatedWords should attach matching words to the correct kanji', () => {
    const mockMainDataSet = [
        { kanji: '食', strokes: 9 },
        { kanji: '猫', strokes: 11 }
    ];

    const mockWordsMap = new Map();
    mockWordsMap.set('食', [{ writtenForm: '食事', glosses: ['meal'] }]);

    const enrichedData = enrichWithAssociatedWords(mockMainDataSet, mockWordsMap);
    
    // Check '食'
    assert.strictEqual(enrichedData[0].associatedWords.length, 1);
    assert.strictEqual(enrichedData[0].associatedWords[0].writtenForm, '食事');

    // Check '猫' (should be empty array, not undefined)
    assert.ok(Array.isArray(enrichedData[1].associatedWords), 'Each kanji entry must have an "associatedWords" property that is an Array');
    assert.strictEqual(enrichedData[1].associatedWords.length, 0);
});