import { getKanjiByLevel } from './kanjiLoader.js';
import { getVocabList } from './vocabLoader.js';
import { saveDataset } from './writer.js';

const targetLevel = process.argv[2];

if (!targetLevel) {
  console.error("Usage: node src/index.js <level> (e.g., n4)");
  process.exit(1);
}

console.log(`--- Running Pipeline for ${targetLevel.toUpperCase()} ---`);

const kanjiData = getKanjiByLevel(targetLevel);
const vocabData = getVocabList(targetLevel);



const dataset = kanjiData.map(([kanjiCharacter, data]) => {
  return {
    kanji: kanjiCharacter,
    ...data,
    associatedVocab: vocabData.filter(vocab => vocab.writtenForm.includes(kanjiCharacter))
  };
});

saveDataset(dataset, 'processed-kanji-data.json');




/**
console.log(`Pipeline complete! Found ${dataset.length} kanji.`);
 if (dataset.length > 0) {
  console.log('Sample entry:', JSON.stringify(dataset[0], null, 2));
}
*/