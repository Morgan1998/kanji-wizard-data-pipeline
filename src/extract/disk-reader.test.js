import { test, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import { readRawFile } from './disk-reader.js';

test('readRawFile should return content when file exists', async () => {
    mock.method(fs, 'readFile', async () => '{"kanji": "食"}');

    const result = await readRawFile('dummy/path.json');

    assert.strictEqual(result, '{"kanji": "食"}');
});

test('readRawFile should throw an error if no path is provided', async () => {
    await assert.rejects(
        async () => await readRawFile(null),
        { message: /A valid file path parameter must be specified/ }
    );
});