import test from 'node:test';
import assert from 'node:assert';
import { enrichWithTargetKanjiReadingType } from './words-reading-type-enricher.js';

test('enrichWithTargetKanjiReadingType should correctly identify kun and on readings for single-kanji words', () => {
    const mockDataSet = [
        {
            kanji: '日',
            kun_readings: ['ひ', 'か.‐'],
            on_readings: ['ニチ', 'ジツ'],
            associatedWords: [
                { writtenForm: '日', readings: ['ひ'] },
                { writtenForm: '日', readings: ['にち'] }
            ]
        }
    ];

    const result = enrichWithTargetKanjiReadingType(mockDataSet);
    const words = result[0].associatedWords;

    assert.deepStrictEqual(words[0].targetKanjiReadingType, ['kun']);
    assert.deepStrictEqual(words[1].targetKanjiReadingType, ['on']);
});

test('enrichWithTargetKanjiReadingType should assign an empty array to multi-kanji compound words to prevent false classifications', () => {
    const mockDataSet = [
        {
            kanji: '一',
            kun_readings: ['ひと.つ'],
            on_readings: ['イチ', 'イツ'],
            associatedWords: [
                { writtenForm: '一人', readings: ['ひとり'] }, // Multi-kanji jukujikun
                { writtenForm: '一', readings: ['いち'] }     // Single kanji
            ]
        }
    ];

    const result = enrichWithTargetKanjiReadingType(mockDataSet);
    const words = result[0].associatedWords;

    // Multi-kanji compound should be bypassed with an empty array for manual review
    assert.deepStrictEqual(words[0].targetKanjiReadingType, []);

    // Single kanji word should still be processed normally
    assert.deepStrictEqual(words[1].targetKanjiReadingType, ['on']);
});