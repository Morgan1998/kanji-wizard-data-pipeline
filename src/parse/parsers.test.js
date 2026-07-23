import test from 'node:test';
import assert from 'node:assert';
import { parseDataset } from './parsers.js';

test('parseDataset should successfully parse a valid single-character kanji line-break list', () => {
    const rawInput = "水\n火\n木";
    const result = parseDataset(rawInput);

    assert.deepStrictEqual(result, [
        { kanji: "水" },
        { kanji: "火" },
        { kanji: "木" }
    ]);
});

test('parseDataset should reject invalid line-break data with extra characters or non-kanji', () => {
    const rawInput = "水\nj"; // 'j' violates the single kanji rule

    assert.throws(() => {
        parseDataset(rawInput);
    }, /Schema Error/);
});

test('parseDataset should successfully parse a valid strict JSON array of objects', () => {
    const rawInput = JSON.stringify([
        { kanji: "水" },
        { kanji: "火" }
    ]);
    const result = parseDataset(rawInput);

    assert.deepStrictEqual(result, [
        { kanji: "水" },
        { kanji: "火" }
    ]);
});

test('parseDataset should reject JSON if an object contains extra illegal properties', () => {
    const rawInput = JSON.stringify([
        { kanji: "水", illegalProp: "boom" } // Violates the "ONLY kanji" rule
    ]);

    assert.throws(() => {
        parseDataset(rawInput);
    }, /Schema Error/);
});

test('parseDataset should reject JSON if the root is not an array', () => {
    const rawInput = JSON.stringify({ kanji: "水" }); // Root is an object, not array

    assert.throws(() => {
        parseDataset(rawInput);
    }, /Schema Error/);
});