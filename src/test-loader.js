import { getVocabList } from './vocabLoader.js';

const vocab = getVocabList();

console.log('--- Testing Vocab Loader ---');
if (vocab.length > 0) {
  console.log(`Successfully loaded ${vocab.length} vocab words.`);
  console.log('First entry:', vocab[0]);
} else {
  console.log('Loader returned empty or failed.');
}
