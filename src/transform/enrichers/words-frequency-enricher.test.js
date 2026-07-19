import { test } from 'node:test';
import assert from 'node:assert';
import { enrichWordsWithFrequency } from './words-frequency-enricher.js';

test('enrichWordsWithFrequency should update associatedWords with frequency rank', () => {
    const mockDataSet = [{
        id: 1,
        associatedWords: [
            { writtenForm: '猫' },
            { writtenForm: '秘密' }
        ]
    }];

    const frequencyMap = new Map([
        ['猫', 105],
        ['秘密', 200]
    ]);

    const result = enrichWordsWithFrequency(mockDataSet, frequencyMap);

    const updatedWords = result[0].associatedWords;
    
    assert.strictEqual(updatedWords[0].frequency, 105);
    assert.strictEqual(updatedWords[1].frequency, 200);
});

test('enrichWordsWithFrequency should assign null if frequency is missing', () => {
    const mockDataSet = [{
        associatedWords: [{ writtenForm: '未知' }]
    }];

    const emptyMap = new Map();

    const result = enrichWordsWithFrequency(mockDataSet, emptyMap);

    assert.strictEqual(result[0].associatedWords[0].frequency, null);
});