import { test } from 'node:test';
import assert from 'node:assert';
import { buildWordsMap } from './words-mapper.js';

test('buildWordsMap should correctly map kanji to a words entries', () => {
    const mockData = [{
        writtenForm: '食事',
        id: '123',
        readings: ['しょくじ'],
        glosses: ['meal']
    }];

    const map = buildWordsMap(mockData);

    const foodKanjiEntries = map.get('食');
    assert.ok(foodKanjiEntries, 'Map should contain an entry for 食, which in this case should be 食事');
    assert.strictEqual(foodKanjiEntries.length, 1);
    assert.strictEqual(foodKanjiEntries[0].writtenForm, '食事');
    assert.strictEqual(foodKanjiEntries[0].id, '123');
})