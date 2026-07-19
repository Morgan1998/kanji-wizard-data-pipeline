import { test } from 'node:test';
import assert from 'node:assert';
import { buildWordsJlptMap } from './words-jlpt-mapper.js';

test('buildWordsJlptMap should map words to their first JLPT level', () => {
    const mockInput = {
        '猫': [{ level: 5 }],
        '勉強': [{ level: 3 }, { level: 2 }]
    };

    const result = buildWordsJlptMap(mockInput);

    assert.strictEqual(result.get('猫'), 5);
    assert.strictEqual(result.get('勉強'), 3); 
});

test('buildWordsJlptMap should ignore entries with empty arrays', () => {
    const mockInput = {
        '謎': [] 
    };

    const result = buildWordsJlptMap(mockInput);

    assert.strictEqual(result.has('謎'), false);
});

test('buildWordsJlptMap should throw on invalid input', () => {
    assert.throws(
        () => buildWordsJlptMap(null),
        { message: /Mapper Failure/ }
    );
});