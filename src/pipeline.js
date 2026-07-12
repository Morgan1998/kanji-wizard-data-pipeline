import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { getKanjiByLevel } from './io/loaders/kanji-loader.js';
import { getVocabList } from './io/loaders/vocab-loader.js';
import { assignAssociatedVocab } from './processors/enrichers/kanji-associated-vocab-assigner.js';
import { createJlptMap } from './processors/enrichers/associated-vocab-jlpt-map-loader.js';
import { assignJlptLevelToAssociatedVocab } from './processors/enrichers/associated-vocab-jlpt-assigner.js';
import { tokenizeVocab } from './processors/tokenizers/vocab-tokenizer.js';
import { saveKanjiwithVocabList } from './io/writer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');



const SOURCES = {
  kanjiSource: 'kanji_jlpt_only.json',
  vocabMainDictionarySource: 'jmdict-eng-common-3.6.2.json',
  vocabJlptSource: 'JLPT_vocab_ALL.json',
}

const PATHS = {
  kanjiSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.kanjiSource),
  vocabMainDictionarySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.vocabMainDictionarySource),
  vocabJlptSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.vocabJlptSource),
  outputDirectory: join(ROOT_DIR, 'data/processed')
};

export async function runPipeline(targetLevels, options = {}) {
  try {
    const targetLevelsArray = Array.isArray(targetLevels) ? targetLevels : [targetLevels];
    const kanjiList = getKanjiByLevel(targetLevelsArray);
    const vocabularyList = getVocabList(PATHS.vocabMainDictionarySourcePath); 
    
    let kanjiWithVocabList = assignAssociatedVocab(kanjiList, vocabularyList);

    const vocabJlptMap = createJlptMap(PATHS.vocabJlptSourcePath);
    kanjiWithVocabList = assignJlptLevelToAssociatedVocab(kanjiWithVocabList, vocabJlptMap);


    const sortedLevels = [...targetLevelsArray].sort();
    const levelsString = sortedLevels.join('-');
    const fileName = `${levelsString}-kanji-with-vocab.json`;
    saveKanjiwithVocabList(kanjiWithVocabList, fileName, PATHS.outputDirectory);
    
    console.log(`Pipeline complete! Saved ${kanjiWithVocabList.length} items.`);
  } catch (error) {
    console.error("Pipeline failure:", error);
    process.exit(1);
  }
}