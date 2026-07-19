import { test } from 'node:test';
import assert from 'node:assert';
import { filterWordsWithoutFrequency } from './words-without-frequency-filterer.js';

test('filterWordsWithoutFrequency should remove only entries where frequency is null', () => {
    const mockDataSet = [{
        associatedWords: [
            { writtenForm: '猫', frequency: 1 },
            { writtenForm: '不明', frequency: null },
            { writtenForm: '犬', frequency: 5 }
        ]
    }];

    const result = filterWordsWithoutFrequency(mockDataSet);
    const filtered = result[0].associatedWords;

    assert.strictEqual(filtered.length, 2, 'Should have removed one word');
    assert.ok(filtered.every(w => w.frequency !== null), 'No null frequencies should remain');
});

test('filterWords should return an empty array if all words have null frequency', () => {
    const mockDataSet = [{
        associatedWords: [{ writtenForm: '空', frequency: null }]
    }];

    const result = filterWordsWithoutFrequency(mockDataSet);
    assert.strictEqual(result[0].associatedWords.length, 0);
});