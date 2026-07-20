import { test } from 'node:test';
import assert from 'node:assert';
import { maxOutWords } from './words-maxer.js';

test('maxOutWords should limit the associatedWords array to the specified amount', () => {
    const mockDataSet = [{
        associatedWords: [1, 2, 3, 4, 5, 6, 7, 8]
    }];
    
    const result = maxOutWords(mockDataSet, { maxWords: 3 });
    
    assert.strictEqual(result[0].associatedWords.length, 3);
    assert.deepStrictEqual(result[0].associatedWords, [1, 2, 3]);
});

test('maxOutWords should default to 5 if no options provided', () => {
    const mockDataSet = [{
        associatedWords: [1, 2, 3, 4, 5, 6]
    }];
    
    const result = maxOutWords(mockDataSet, {});
    
    assert.strictEqual(result[0].associatedWords.length, 5);
});

test('maxOutWords should not slice a kanjyEntry if max is more than the length of the entry'), () => {
        const mockDataSet = [{
        associatedWords: [1, 2, 3, 4, 5, 6, 7, 8]
    }];
    
    const result = maxOutWords(mockDataSet, { maxWords: 10 });
    
    assert.strictEqual(result[0].associatedWords.length, 8);
    assert.deepStrictEqual(result[0].associatedWords, [1, 2, 3, 4, 5, 6, 7, 8]);
}