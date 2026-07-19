import { test } from 'node:test';
import assert from 'node:assert';
import { filterByLevel } from './kanji-data-array-jlpt-filterer.js';

test('filterByLevel should return only entries matching the specific level', () => {
    const mockData = [
        { text: '猫', jlpt: 5 },
        { text: '犬', jlpt: 2 },
        { text: '鳥', jlpt: 5 }
    ];

    const result = filterByLevel(mockData, 5);

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].text, '猫');
    assert.strictEqual(result[1].text, '鳥');
});

test('filterByLevel should handle entries with missing jlpt fields gracefully', () => {
    const mockData = [
        { text: '猫', jlpt: 5 },
        { text: '???' } 
    ];

    const result = filterByLevel(mockData, 5);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].text, '猫');
});

test('filterByLevel should throw if the data input is not an array', () => {
    assert.throws(
        () => filterByLevel(null, 5),
        { message: /Filter Failure/ }
    );
});