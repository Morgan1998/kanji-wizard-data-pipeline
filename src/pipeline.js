import { program } from "commander";
import { PATHS } from "#config/constants";
import { SUPPORTED_LEVELS } from "#config/constants";

import { readRawFile } from "#extract/disk-reader";
import { parseJsonToObject } from "#parse/json-parser";
import { parseXmlToObject } from "#parse/xml-parser";

import { normalizeKanjiData } from "#transform/normalizers/kanji-data-normalizer";
import { pluckWords } from "#transform/selectors/main-dictionary-words-plucker";
import { filterPluckedWordsArray } from "#transform/filterers/plucked-words-array-filterer";
import { buildWordsMap } from "#transform/mappers/words-mapper";
import { enrichWithAssociatedWords } from "#transform/enrichers/associated-words-enricher";



program
  .name('kanji-wizard-pipeline')
  .version('1.0.0')
  .requiredOption('-l, --level <level>', 'Filtering level (e.g., N3)', 'N5')
  .parse(process.argv);

const options = program.opts();

if (!SUPPORTED_LEVELS.includes(options?.level?.toLowerCase())) {
  console.error(`[Error] Invalid level: "${options.level}". Supported levels: ${SUPPORTED_LEVELS.join(', ')}`);
  process.exit(1);
}

async function runPipeline(options) {
  try {
    const kanjiDataString = await readRawFile(PATHS.kanjiDataSourcePath);
    const kanjiDataObject = parseJsonToObject(kanjiDataString);
    const kanjiDataArray = normalizeKanjiData(kanjiDataObject);
    const level = options?.level?.toLowerCase();
    const kanjiDataArrayByLevel = filterByLevel(kanjiDataArray, level);
    let mainDataSet = kanjiDataArrayByLevel;

    const mainDictString = await readRawRile(PATHS.mainDictionarySourcePath);
    const mainDictObject = parseJsonToObject(vocabDictString);
    const mainDictPluckedWordsArray = pluckWords(mainDictObject);
    const filteredPluckedWordsArray = filterPluckedWordsArray(mainDictPluckedWordsArray);
    const wordsMap = buildWordsMap(filteredPluckedWordsArray);
    mainDataSet = enrichWithAssociatedWords(mainDataSet, wordsMap);


    const vocabJlptMap = createJlptMap(PATHS.wordsJlptSourcePath);
    kanjiWithVocabList = assignJlptLevelToVocab(kanjiWithVocabList, vocabJlptMap);

    const vocabFrequencyMap =createFrequencyMap(PATHS.wordsFrequencySourcePath);
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

runPipeline();