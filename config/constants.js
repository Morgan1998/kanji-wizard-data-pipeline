import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

export const SOURCES = {
  kanjiDataSource: 'kanji.json',
  mainDictionarySource: 'jmdict-eng-common-3.6.2.json',
  wordsJlptSource: 'JLPT_vocab_ALL.json',
  literaryFrequenciesSource: 'literary-frequencies.json',
  spokenFrequenciesSource: 'spoken-frequencies.json',
  tubelexOccurrencesSource: 'tubelex-ja.tsv'
};

export const PATHS = {
  kanjiSetDirectoryPath: join(ROOT_DIR, 'data/raw/kanji-sets'),

  rawDataDirectoryPath: join(ROOT_DIR, 'data/raw'),

  kanjiDataSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.kanjiDataSource),
  mainDictionarySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.mainDictionarySource),
  wordsJlptSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.wordsJlptSource),
  literaryFrequenciesSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.literaryFrequenciesSource),
  spokenFrequenciesSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.spokenFrequenciesSource),
  tubelexOccurrencesSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.tubelexOccurrencesSource),
  
  jsonOutputDirectory: join(ROOT_DIR, 'data/processed/json'),
  tsvOutputDirectory: join(ROOT_DIR, 'data/processed/tsv'),
};

export const SUPPORTED_LEVELS = [1, 2, 3, 4, 5];