import { test } from 'node:test';
import assert from 'node:assert';
import { filterPluckedWords } from './plucked-words-filterer.js';

test('filterPluckedWords should correctly filter and flatten vocabulary entries', () => {
    const mockPluckedWords = [
            {
                id: 1,
                kanji: [{ text: '猫', common: true }, { text: '非猫', common: false }],
                kana: [{ text: 'ねこ', appliesToKanji: ['猫'] }, { text: 'にゃー', appliesToKanji: ['*'] }],
                sense: [{ gloss: [{ text: 'cat' }] }]
            }
        ];

    const result = filterPluckedWords(mockPluckedWords);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].writtenForm, '猫');
    assert.strictEqual(result[0].readings.length, 2); 
    assert.deepStrictEqual(result[0].glosses, ['cat']);
});

test('filterPluckedWords should return empty array when no common kanji exist', () => {
    const mockData = [
            {
                id: 2,
                kanji: [{ text: '珍', common: false }], // Not common
                kana: [],
                sense: []
            }
        ];

    const result = filterPluckedWords(mockData);
    assert.strictEqual(result.length, 0);
});