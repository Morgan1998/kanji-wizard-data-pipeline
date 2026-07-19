import { test } from 'node:test';
import assert from 'node:assert';
import { pluckWords } from './main-dictionary-words-plucker.js';

test('pluckWords should return a copy of the words array', () => {
    let mockDict = {
        metadata: [],
        metadata2: [],
        words: [{ id: 1, text: '猫' }, { id: 2, text: '犬' }]
    };

    const result = pluckWords(mockDict);

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].text, '猫');
    
    // Check that we are truly making a copy and not modifying the original 
    result.push({ id: 3, text: '鳥' });
    assert.notStrictEqual(result.length, mockDict.words.length);
});

test('pluckWords should throw if input is not an object', () => {
    assert.throws(
        () => pluckWords(null),
        { message: /Plucker Failure/ }
    );
});

test('pluckWords should throw if words array is missing', () => {
    const invalidDict = { notWords: [] };
    
    assert.throws(
        () => pluckWords(invalidDict),
        { message: /Extractor Failure/ }
    );
});