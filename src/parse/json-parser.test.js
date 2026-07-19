import { test } from 'node:test';
import assert from 'node:assert';
import { parseJsonToObject } from './json-parser.js';

test('parseJsonToObject should return an object when valid JSON is provided', () => {
    const input = '{"kanji": "食", "meaning": "meal"}';
    const result = parseJsonToObject(input);
    
    assert.strictEqual(result.kanji, '食');
    assert.strictEqual(result.meaning, 'meal');
});

test('parseJsonToObject should throw an error for empty or blank strings', () => {
    assert.throws(
        () => parseJsonToObject('   '),
        { message: /Cannot process an empty or undefined JSON resource string/ }
    );
});

test('parseJsonToObject should throw an error for malformed JSON', () => {
    const malformed = '{"kanji": "食", "meaning": "meal"'; // Missing closing brace
    
    assert.throws(
        () => parseJsonToObject(malformed),
        { message: /Structural violation/ }
    );
});