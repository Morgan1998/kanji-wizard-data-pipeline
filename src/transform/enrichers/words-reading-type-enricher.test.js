import { test } from 'node:test';
import assert from 'node:assert';
import { enrichWithReadingType } from './words-reading-type-enricher.js';

test('enrichWithReadingType should add a reading type property to words of associateWords', () => {

    const mockDataSet = [{
        "kanji": "高",
        "freq_mainichi_shinbun": 65,
        "grade": 2,
        "heisig_en": "tall",
        "jlpt": 5,
        "kun_readings": [
        "-だか",
        "たか",
        "たか.い",
        "たか.まる",
        "たか.める"
        ],
        "meanings": [
        "expensive",
        "high",
        "tall"
        ],
        "name_readings": [
        "か",
        "こ",
        "じょい",
        "た",
        "はか"
        ],
        "notes": [],
        "on_readings": [
        "コウ"
        ],
        "stroke_count": 10,
        "unicode": "9AD8",
        "associatedWords": [
            {
                "writtenForm": "高校",
                "id": "1283500",
                "readings": [
                "こうこう"
                ],
                "glosses": [
                "senior high school",
                "high school"
                ],
                "jlptLevel": 4,
                "frequency": 2117
            },
            {
                "writtenForm": "可能性が高い",
                "id": "1191090",
                "readings": [
                "かのうせいがたかい"
                ],
                "glosses": [
                "very likely",
                "very probable"
                ],
                "jlptLevel": null,
                "frequency": 4218
            },
            {
                "writtenForm": "高高高",
                "readings": [
                    "ばなな"
                ]
            }
        ]
    }];

    const result = enrichWithReadingType(mockDataSet);

    const updatedWords = result[0].associatedWords;

    assert.ok(Array.isArray(updatedWords[0].readingType));
    assert.ok(Array.isArray(updatedWords[2].readingType));
    assert.deepStrictEqual(updatedWords[0].readingType, ['on']);
    assert.deepStrictEqual(updatedWords[1].readingType, ['kun']);
    assert.deepStrictEqual(updatedWords[2].readingType, []);
})