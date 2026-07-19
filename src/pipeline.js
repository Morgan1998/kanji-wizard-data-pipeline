import { Command } from "commander";
import { PATHS } from "#config/constants";
import { SUPPORTED_LEVELS } from "#config/constants";

import { readRawFile } from "#extract/disk-reader";
import { parseJsonToObject } from "#parse/json-parser";
import { parseXmlToObject } from "#parse/xml-parser";

import { normalizeKanjiData } from "#transform/normalizers/kanji-data-normalizer";
import { filterByLevel } from "#transform/filterers/kanji-data-array-jlpt-filterer";
import { pluckWords } from "#transform/selectors/main-dictionary-words-plucker";
import { filterPluckedWords } from "#transform/filterers/plucked-words-filterer";
import { buildWordsMap } from "#transform/mappers/words-mapper";
import { enrichWithAssociatedWords } from "#transform/enrichers/associated-words-enricher";

import { buildWordsJlptMap } from "#transform/mappers/words-jlpt-mapper";
import { enrichWordsWithJlpt } from "#transform/enrichers/words-jlpt-enricher";

import { buildWordsFrequencyMap } from "#transform/mappers/words-frequency-mapper";
import { enrichWordsWithFrequency } from "#transform/enrichers/words-frequency-enricher"; 

import { filterWordsWithoutFrequency } from '#transform/filterers/words-without-frequency-filterer';
import { sortWordsByFrequency } from "#transform/sorters/words-sorter-by-frequency";
import { maxOutWords } from '#transform/filterers/words-maxer';

import { saveToJson } from "#load/json-writer";

const program = new Command();

program
  .name('kanji-wizard-pipeline')
  .version('1.0.0')
  .requiredOption(
    '-l, --level <level>', 
    'Filtering level (e.g., N3)', 
    (value) => {
      const numberMatch = value.trim().match(/\d+/);
      const levelNumber = numberMatch ? parseInt(numberMatch[0], 10) : NaN;

      if (!SUPPORTED_LEVELS.includes(levelNumber)) {
        throw new InvalidOptionArgumentError(
          `Invalid level: "${value}". Supported levels: ${SUPPORTED_LEVELS.map(level => `N${level}`).join(', ')}`
        );
      }
      return levelNumber;
    },
    5
  )
  .requiredOption('-m, --maxWords <amount>', 'Max number of example words', (value) => parseInt(value, 10), 5)
  .parse(process.argv); 

const options = program.opts();
const level = options.level;




async function runPipeline() {
  try {
    const kanjiDataString = await readRawFile(PATHS.kanjiDataSourcePath);
    const kanjiDataObject = parseJsonToObject(kanjiDataString);
    const kanjiDataArray = normalizeKanjiData(kanjiDataObject);
    const kanjiDataArrayByLevel = filterByLevel(kanjiDataArray, level);
    //console.log(kanjiDataArrayByLevel);
    let mainDataSet = kanjiDataArrayByLevel;
    //console.log(mainDataSet);

    const mainDictString = await readRawFile(PATHS.mainDictionarySourcePath);
    // console.log(mainDictString);
    const mainDictObject = parseJsonToObject(mainDictString);
    //console.log(mainDictObject);
    const pluckedWords = pluckWords(mainDictObject);
    //console.log(pluckedWords);
    const filteredPluckedWords = filterPluckedWords(pluckedWords);
    //console.log(filteredPluckedWords);
    const wordsMap = buildWordsMap(filteredPluckedWords);
    mainDataSet = enrichWithAssociatedWords(mainDataSet, wordsMap);
    //console.log(mainDataSet);

    
    const wordsJlptString = await readRawFile(PATHS.wordsJlptSourcePath);
    const wordsJlptObject = parseJsonToObject(wordsJlptString);
    const wordsJlptMap = buildWordsJlptMap(wordsJlptObject);
    mainDataSet = enrichWordsWithJlpt(mainDataSet, wordsJlptMap);
    //console.log(mainDataSet);
    

    const wordsFrequencyString = await readRawFile(PATHS.wordsFrequencySourcePath);
    const wordsFrequencyObject = parseJsonToObject(wordsFrequencyString);
    //console.log(JSON.stringify(wordsFrequencyObject, null, 2));
    const wordsFrequencyMap = buildWordsFrequencyMap(wordsFrequencyObject);
    //console.log(`Words frequency Map: ${JSON.stringify(wordsFrequencyMap, null, 2)}`);
    mainDataSet = enrichWordsWithFrequency(mainDataSet, wordsFrequencyMap);
    //console.log(JSON.stringify(mainDataSet, null, 2));
    

    mainDataSet = filterWordsWithoutFrequency(mainDataSet);
    //console.log(mainDataSet);
    mainDataSet = sortWordsByFrequency(mainDataSet);
    mainDataSet = maxOutWords(mainDataSet, options);


    






  const fileName = `n${options.level}-kanji-with-vocab.json`;
    saveToJson(mainDataSet, fileName, PATHS.jsonOutputDirectory);
    
    console.log(`Pipeline complete! Saved ${mainDataSet.length} items.`);
  } catch (error) {
    console.error("Pipeline failure:", error);
    process.exit(1);
  }
}

runPipeline();