import { test } from 'node:test';
import assert from 'node:assert';
import { buildWordsFrequencyMap } from './words-frequency-mapper.js';

test('buildWordsFrequencyMap should correctly map words to their frequency values', () => {
    const mockData = [
        [
            "滴定",
            "freq",
            {
            "reading": "てきてい",
            "frequency": {
                "value": 317296,
                "displayValue": "317296"
            }
            }
        ],
        [
            "先非",
            "freq",
            {
            "reading": "せんぴ",
            "frequency": {
                "value": 317299,
                "displayValue": "317299"
            }
            }
        ]
    ];

    const result = buildWordsFrequencyMap(mockData);

    assert.strictEqual(result.get("滴定"), 317296);
    assert.strictEqual(result.get("先非"), 317299);
    assert.strictEqual(result.size, 2);
});

test('buildWordsFrequencyMap should skip malformed entries without crashing', () => {
    const mockData = [
        [
            "滴定",
            "freq",
            {
            "reading": "てきてい",
            "banana": {
                "value": 317296,
                "displayValue": "317296"
            }
            }
        ],
        [
            "先非",
            "freq",
            {
            "reading": "せんぴ",
            "frequency": {
                "value": 317299,
                "displayValue": "317299"
            }
            }
        ]
    ];

    const result = buildWordsFrequencyMap(mockData);

    assert.strictEqual(result.size, 1);
    assert.strictEqual(result.get("先非"), 317299);
    assert.strictEqual(result.has("滴定"), false);
});

test('buildWordsFrequencyMap should throw if input is not an array', () => {
    assert.throws(
        () => buildWordsFrequencyMap({ "not": "an array" }),
        { message: /Mapper Failure/ }
    );
});