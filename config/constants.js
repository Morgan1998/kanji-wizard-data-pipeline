import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

export const SOURCES = {
  kanjiDataSource: 'kanji_jlpt_only.json',
  mainDictionarySource: 'jmdict-eng-common-3.6.2.json',
  wordsJlptSource: 'JLPT_vocab_ALL.json',
  wordsFrequencySource: 'term_meta_bank_1.json',
};

export const PATHS = {
  kanjiDataSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.kanjiDataSource),
  mainDictionarySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.mainDictionarySource),
  wordsJlptSourcePath: join(ROOT_DIR, 'data/raw', SOURCES.wordsJlptSource),
  wordsFrequencySourcePath: join(ROOT_DIR, 'data/raw', SOURCES.wordsFrequencySource),
  jsonOutputDirectory: join(ROOT_DIR, 'data/processed/json'),
  tsvOutputDirectory: join(ROOT_DIR, 'data/processed/tsv'),
};

export const SUPPORTED_LEVELS = ['n1', 'n2', 'n3', 'n4', 'n5'];