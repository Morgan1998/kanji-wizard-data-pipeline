import { test } from 'node:test';
import assert from 'node:assert';
import { enrichWordsWithJlpt } from './words-jlpt-enricher.js';

test('enrichWordsWithJlpt should add jlptLevel to associated words', () => {
    const mockDataSet = [
        {
            id: 1,
            associatedWords: [
                { writtenForm: '猫' },
                { writtenForm: '未知' } // Not in Map
            ]
        }
    ];

    const jlptMap = new Map();

    jlptMap.set('猫', 5);


    const result = enrichWordsWithJlpt(mockDataSet, jlptMap);

    const enriched = result[0].associatedWords;
    
    assert.strictEqual(enriched[0].jlptLevel, 5); 
    assert.strictEqual(enriched[1].jlptLevel, null);
});