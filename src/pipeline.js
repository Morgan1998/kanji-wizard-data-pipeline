import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { getKanjiByLevel } from './io/loaders/kanji-loader.js';
import { getVocabList } from './io/loaders/vocab-loader.js';
import { assignAssociatedVocab } from './processors/enrichers/kanji-associated-vocab-assigner.js';
import { createJlptMap } from './io/loaders/associated-vocab-jlpt-map-loader.js';
import { assignJlptLevelToVocab } from './processors/enrichers/associated-vocab-jlpt-assigner.js';
import { createFrequencyMap } from './io/loaders/associated-vocab-frequency-map-loader.js';
import { assignFrequencyToVocab } from './processors/enrichers/associated-vocab-frequency-assigner.js';
import { tokenizeVocab } from './processors/tokenizers/vocab-tokenizer.js';
import { filterAndSortVocab } from './processors/filterers/vocab-filterer.js';
import { saveKanjiwithVocabList } from './io/writer.js';
import { buildTsv } from './build-tsv.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');



const SOURCES = {
  kanjiSource: 'kanji_jlpt_only.json',
  vocabMainDictionarySource: 'jmdict-eng-common-3.6.2.json',
  vocabJlptSource: 'JLPT_vocab_ALL.json',
  vocabFrequencySource: 'term_meta_bank_1.json',
}

const PATHS = {
  kanjiSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.kanjiSource),
  vocabMainDictionarySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.vocabMainDictionarySource),
  vocabJlptSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.vocabJlptSource),
  vocabFrequencySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.vocabFrequencySource),
  jsonOutputDirectory: join(ROOT_DIR, 'data/processed/json'),
  tsvOutputDirectory: join(ROOT_DIR, 'data/processed/tsv'),
};

export async function runPipeline(options) {
  try {
    const targetLevelsArray = Array.isArray(options.targetLevels) ? options.targetLevels : [options.targetLevels];
    const kanjiList = getKanjiByLevel(targetLevelsArray);
    const vocabularyList = getVocabList(PATHS.vocabMainDictionarySourcePath); 
    
    let kanjiWithVocabList = assignAssociatedVocab(kanjiList, vocabularyList);

    const vocabJlptMap = createJlptMap(PATHS.vocabJlptSourcePath);
    kanjiWithVocabList = assignJlptLevelToVocab(kanjiWithVocabList, vocabJlptMap);

    const vocabFrequencyMap =createFrequencyMap(PATHS.vocabFrequencySourcePath);
    kanjiWithVocabList = assignFrequencyToVocab(kanjiWithVocabList, vocabFrequencyMap);

    kanjiWithVocabList = await tokenizeVocab(kanjiWithVocabList);

    kanjiWithVocabList = filterAndSortVocab(kanjiWithVocabList, options.maxVocab);


    const sortedLevels = [...targetLevelsArray].sort();
    const levelsString = sortedLevels.join('-');
    const fileName = `${levelsString}-kanji-with-vocab.json`;
    saveKanjiwithVocabList(kanjiWithVocabList, fileName, PATHS.jsonOutputDirectory);
    const jsonDataOutputPath = `${PATHS.jsonOutputDirectory}/${fileName}`;
    if (options.buildTsv === true) {
      buildTsv(jsonDataOutputPath, PATHS.tsvOutputDirectory);
    }
    
    console.log(`Pipeline complete! Saved ${kanjiWithVocabList.length} items.`);
  } catch (error) {
    console.error("Pipeline failure:", error);
    process.exit(1);
  }
}