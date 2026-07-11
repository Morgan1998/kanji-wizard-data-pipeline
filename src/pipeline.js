import { getKanjiByLevel } from './io/loaders/kanji-loader.js';
import { getVocabList } from './io/loaders/vocab-loader.js';
import { getTokenizer } from './services/morphology.js';
import { tokenizeVocabList } from './processors/tokenizers/vocab-list-tokenizer.js';
import { filterByJlpt } from './processors/filterers/jlpt-filterer.js';
import { filterByFrequency } from './processors/filterers/frequency-filterer.js';
import { saveDataset } from './io/writer.js';

export async function runPipeline(targetLevel, options = {}) {
  try {
    const tokenizer = await getTokenizer();
    const kanjiList = getKanjiByLevel(targetLevel);
    
    let vocabularyList = getVocabList(); 

    if (options.filterByJlpt) {
      vocabularyList = filterByJlpt(vocabularyList, targetLevel);
    }
    
    if (options.filterByFrequency) {
      vocabularyList = filterByFrequency(vocabularyList, options.minFrequency);
    }
    
    vocabularyList = tokenizeVocabList(vocabularyList, tokenizer);

    const dataset = kanjiList.map(([kanjiCharacter, kanjiMetadata]) => ({
      kanji: kanjiCharacter,
      ...kanjiMetadata,
      associatedVocab: vocabularyList.filter(vocab => 
        vocab.writtenForm.includes(kanjiCharacter)
      )
    }));

    const fileName = `${targetLevel}-kanji-with-vocab.json`;
    saveDataset(dataset, fileName);
    
    console.log(`Pipeline complete! Saved ${dataset.length} items.`);
  } catch (error) {
    console.error("Pipeline failure:", error);
    process.exit(1);
  }
}