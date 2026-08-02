import { test } from 'node:test';
import assert from 'node:assert';
import { enrichKanjiWithSortingGroup } from './kanji-sorting-group-enricher.js';

test('enrichKanjiWithSortingGroup adds the sortingGroup property with the provided option value', () => {
    const inputData = [
        { kanji: '日', strokes: 4 },
        { kanji: '月', strokes: 4 }
    ];
    const sortingGroupOption = 'jlpt-n5';

    const result = enrichKanjiWithSortingGroup(inputData, sortingGroupOption);

    assert.deepStrictEqual(result, [
        { kanji: '日', strokes: 4, sortingGroup: 'jlpt-n5' },
        { kanji: '月', strokes: 4, sortingGroup: 'jlpt-n5' }
    ]);
});

test('enrichKanjiWithSortingGroup falls back to "default" if the sortingGroup option is falsy', () => {
    const inputData = [
        { kanji: '水', strokes: 4 }
    ];

    const result = enrichKanjiWithSortingGroup(inputData, null);

    assert.deepStrictEqual(result, [
        { kanji: '水', strokes: 4, sortingGroup: 'default' }
    ]);
});