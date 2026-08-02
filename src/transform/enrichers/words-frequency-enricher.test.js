import test from 'node:test';
import assert from 'node:assert';
import { enrichWordsWithFrequency } from './words-frequency-enricher.js';

test('enrichWordsWithFrequency should correctly add all three frequency metrics to associated words', () => {
    const mockDataSet = [
        {
            kanji: '日',
            associatedWords: [
                { writtenForm: '今日', meaning: 'today' }
            ]
        }
    ];

    const spokenMap = new Map([['今日', 1500]]);
    const tubelexMap = new Map([['今日', 3200]]);
    const literaryMap = new Map([['今日', 45]]);

    const result = enrichWordsWithFrequency(mockDataSet, spokenMap, tubelexMap, literaryMap);

    const enrichedWord = result[0].associatedWords[0];
    assert.strictEqual(enrichedWord.spokenFrequency, 1500);
    assert.strictEqual(enrichedWord.tubelexOccurrenceCount, 3200);
    assert.strictEqual(enrichedWord.literaryFrequency, 45);
});

test('enrichWordsWithFrequency should default missing metrics to null', () => {
    const mockDataSet = [
        {
            kanji: '水',
            associatedWords: [
                { writtenForm: '未知', meaning: 'unknown' }
            ]
        }
    ];

    const spokenMap = new Map();
    const tubelexMap = new Map();
    const literaryMap = new Map();

    const result = enrichWordsWithFrequency(mockDataSet, spokenMap, tubelexMap, literaryMap);

    const enrichedWord = result[0].associatedWords[0];
    assert.strictEqual(enrichedWord.spokenFrequency, null);
    assert.strictEqual(enrichedWord.tubelexOccurrenceCount, null);
    assert.strictEqual(enrichedWord.literaryFrequency, null);
});

test('enrichWordsWithFrequency should throw an error if any required argument is missing', () => {
    const mockDataSet = [];
    const mockMap = new Map();

    assert.throws(() => {
        enrichWordsWithFrequency(null, mockMap, mockMap, mockMap);
    }, /\[Enricher Failure\] Missing data/);

    assert.throws(() => {
        enrichWordsWithFrequency(mockDataSet, null, mockMap, mockMap);
    }, /\[Enricher Failure\] Missing data/);
});