import { test } from 'node:test';
import assert from 'node:assert';
import { sortWordsByFrequency } from './words-sorter-by-frequency.js';

test('sortWordsByFrequency should order words by frequency ascending', () => {
    const mockDataSet = [{
        associatedWords: [
            { writtenForm: 'C', frequency: 300 },
            { writtenForm: 'A', frequency: 1 },
            { writtenForm: 'B', frequency: 50 }
        ]
    }];

    const result = sortWordsByFrequency(mockDataSet);
    const sorted = result[0].associatedWords;

    assert.strictEqual(sorted[0].writtenForm, 'A');
    assert.strictEqual(sorted[1].writtenForm, 'B');
    assert.strictEqual(sorted[2].writtenForm, 'C');
});

test('sortWords should handle an empty associatedWords array', () => {
    const mockDataSet = [{
        associatedWords: []
    }];

    const result = sortWordsByFrequency(mockDataSet);
    assert.strictEqual(result[0].associatedWords.length, 0);
});