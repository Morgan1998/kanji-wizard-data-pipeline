import { getKanjiByLevel } from './kanjiLoader.js';
import { getVocabList } from './vocabLoader.js';

const targetLevel = process.argv[2];

if (!targetLevel) {
  console.error("Usage: node src/index.js <level> (e.g., n4)");
  process.exit(1);
}

console.log(`--- Running Pipeline for ${targetLevel.toUpperCase()} ---`);

const kanjiData = getKanjiByLevel(targetLevel);
const vocabData = getVocabList(targetLevel);


const dataset = Object.entries(kanjiData).map(([kanji, data]) => {
  return {
    kanji,
    ...data,
    associatedVocab: vocabData.filter(v => v.kanji === kanji)
  };
});


console.log(`Pipeline complete! Found ${dataset.length} kanji.`);
if (dataset.length > 0) {
  console.log('Sample entry:', JSON.stringify(dataset[0], null, 2));
}