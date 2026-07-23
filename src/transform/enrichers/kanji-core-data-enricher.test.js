import { test } from 'node:test';
import  assert  from 'node:assert';
import { enrichWithCoreKanjiData } from './kanji-core-data-enricher.js';

test(`enrichWithCoreKanjiData should take each kanjiEntry of mainDataset, 
    find it's match in the dictionary, and append the dictionary's properties to the kanjiEntry`, () => {
        const mockMainDataSet = [
            {
                kanji: '一'
            },
            {
                kanji: '二'
            }
        ];

        const mockKanjiDataDictionary = {
            "一": {
                "strokes": 1,
                "grade": 1,
                "freq": 2,
                "jlpt_old": 4,
                "jlpt_new": 5,
                "meanings": ["One","One Radical (no.1)"],
                "readings_on": ["いち","いつ"],
                "readings_kun": ["ひと-","ひと.つ"],
                "wk_level": 1,
                "wk_meanings": ["One"],
                "wk_readings_on": ["いち","いつ"],
                "wk_readings_kun": ["!ひと"],
                "wk_radicals": ["Ground"]
            },
            "二": {
                "strokes": 2,
                "grade": 1,
                "freq": 9,
                "jlpt_old": 4,
                "jlpt_new": 5,
                "meanings": ["Two","Two Radical (no. 7)"],
                "readings_on": ["に","じ"],
                "readings_kun": ["ふた","ふた.つ","ふたたび"],
                "wk_level": 1,
                "wk_meanings": ["Two"],
                "wk_readings_on": ["に"],
                "wk_readings_kun": ["!ふた"],
                "wk_radicals": ["Two"]
            }
        };

        const enrichedData = enrichWithCoreKanjiData(mockMainDataSet, mockKanjiDataDictionary);

        assert.strictEqual(enrichedData[0].kanji, '一');
        assert.strictEqual(Object.entries(enrichedData[0]).length, 8);
    })