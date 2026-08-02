import { test } from 'node:test';
import assert from 'node:assert';
import { sortWordsByLiteraryFrequency } from './words-sorter-by-literary-frequency.js';

test('sortWordsByLiteraryFrequency should sort associated words by literary frequency ascending', () => {
    const mockDataSet = [
        {
            kanji: '日',
            associatedWords: [
                { writtenForm: '明日', literaryFrequency: 500 },
                { writtenForm: '今日', literaryFrequency: 10 },
                { writtenForm: '昨日', literaryFrequency: 1200 }
            ]
        }
    ];

    const result = sortWordsByLiteraryFrequency(mockDataSet);

    const sortedForms = result[0].associatedWords.map(w => w.writtenForm);
    assert.deepStrictEqual(sortedForms, ['今日', '明日', '昨日']);
});

test('sortWordsByLiteraryFrequency should handle missing literary frequencies by pushing them to the end', () => {
    const mockDataSet = [
        {
            kanji: '水',
            associatedWords: [
                { writtenForm: '未知', literaryFrequency: null },
                { writtenForm: '水泳', literaryFrequency: 45 },
                { writtenForm: '水道', literaryFrequency: undefined }
            ]
        }
    ];

    const result = sortWordsByLiteraryFrequency(mockDataSet);

    const sortedForms = result[0].associatedWords.map(w => w.writtenForm);
    assert.strictEqual(sortedForms[0], '水泳');
    // Unranked items should be at the back
    assert.ok(sortedForms.slice(1).includes('未知'));
    assert.ok(sortedForms.slice(1).includes('水道'));
});

test('sortWordsByLiteraryFrequency should not mutate the original data set', () => {
    const mockDataSet = [
        {
            kanji: '火',
            associatedWords: [
                { writtenForm: '火事', literaryFrequency: 800 },
                { writtenForm: '火曜日', literaryFrequency: 50 }
            ]
        }
    ];

    const originalOrder = mockDataSet[0].associatedWords.map(w => w.writtenForm);
    sortWordsByLiteraryFrequency(mockDataSet);
    const currentOrder = mockDataSet[0].associatedWords.map(w => w.writtenForm);

    assert.deepStrictEqual(currentOrder, originalOrder);
});