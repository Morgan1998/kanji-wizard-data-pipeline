import { Command } from "commander";
import { PATHS } from "#config/constants";
import { SUPPORTED_LEVELS } from "#config/constants";
import { join } from 'node:path';

import { readRawFile } from "#extract/disk-reader";
import { parseDataset } from "#parse/parsers";
import { parseJsonToObject } from "#parse/json-parser";
import { parseXmlToObject } from "#parse/xml-parser";

import { enrichWithCoreKanjiData } from "#transform/enrichers/kanji-core-data-enricher";

import { pluckWords } from "#transform/selectors/main-dictionary-words-plucker";
import { filterPluckedWords } from "#transform/filterers/plucked-words-filterer";
import { buildWordsMap } from "#transform/mappers/words-mapper";
import { enrichWithAssociatedWords } from "#transform/enrichers/kanji-words-enricher";
import { buildWordsJlptMap } from "#transform/mappers/words-jlpt-mapper";
import { enrichWordsWithJlpt } from "#transform/enrichers/words-jlpt-enricher";
import { buildWordsFrequencyMap } from "#transform/mappers/words-frequency-mapper";
import { buildTubelexOccurrencesMap } from "#transform/mappers/words-tubelex-occurrence-mapper";
import { enrichWordsWithFrequency } from "#transform/enrichers/words-frequency-enricher"; 

import { sortWordsByPriority } from "#transform/sorters/words-sorter-by-priority";
import { maxOutWords } from '#transform/filterers/words-maxer';
import { enrichWithTargetKanjiReadingType } from "#transform/enrichers/words-reading-type-enricher";
import { replaceReadingTypes } from "#transform/replacers/reading-type-replacer";
import { enrichKanjiWithSvg } from "#transform/enrichers/kanji-svg-enricher";
import { enrichKanjiWithSortingGroup } from '#transform/enrichers/kanji-sorting-group-enricher';

import { reportMissingReadingTypes } from "#load/pipeline-reporter";

import { saveToJson } from "#load/json-writer";
import { buildTsv } from "#load/tsv-writer";

const program = new Command();

program
  .name('kanji-wizard-pipeline')
  .version('1.0.0')
  .requiredOption('-a, --sortingGroup <learningSource>', 'The learning source that aligns with the kanji list provided (e.g. jlpt n5, rtk, wanikani)')
  .option('-f, --filename <name>', 'The base kanji list filename located in data/raw/kanji-set', 'kanji-set.txt')
  .option('-m, --maxWords <amount>', 'Max number of example words', (value) => parseInt(value, 10), 5)
  .parse(process.argv); 

const options = program.opts();
const kanjiSetSource = join(PATHS.kanjiSetDirectoryPath, options.filename);



async function runPipeline() {
  try {
    const kanjiSetString = await readRawFile(kanjiSetSource);
    let mainDataSet = parseDataset(kanjiSetString);

    const externalKanjiDataString = await readRawFile(PATHS.kanjiDataSourcePath);
    const kanjiDictionary = JSON.parse(externalKanjiDataString);
    mainDataSet = enrichWithCoreKanjiData(mainDataSet, kanjiDictionary);


    const mainDictString = await readRawFile(PATHS.mainDictionarySourcePath);
    const mainDictObject = parseJsonToObject(mainDictString);
    const pluckedWords = pluckWords(mainDictObject);
    const filteredPluckedWords = filterPluckedWords(pluckedWords);
    const wordsMap = buildWordsMap(filteredPluckedWords);
    mainDataSet = enrichWithAssociatedWords(mainDataSet, wordsMap);

    
    const wordsJlptString = await readRawFile(PATHS.wordsJlptSourcePath);
    const wordsJlptObject = parseJsonToObject(wordsJlptString);
    const wordsJlptMap = buildWordsJlptMap(wordsJlptObject);
    mainDataSet = enrichWordsWithJlpt(mainDataSet, wordsJlptMap);
    
    const spokenFrequenciesString = await readRawFile(PATHS.spokenFrequenciesSourcePath);
    const spokenFrequenciesObject = parseJsonToObject(spokenFrequenciesString);
    const spokenFrequenciesMap = buildWordsFrequencyMap(spokenFrequenciesObject);
    const tubelexOccurrenceMap = await buildTubelexOccurrencesMap(PATHS.tubelexOccurrencesSourcePath);
    const literaryFrequenciesString = await readRawFile(PATHS.literaryFrequenciesSourcePath);
    const literaryFrequenciesObject = parseJsonToObject(literaryFrequenciesString);
    const literaryFrequenciesMap = buildWordsFrequencyMap(literaryFrequenciesObject);
    mainDataSet = enrichWordsWithFrequency(mainDataSet, spokenFrequenciesMap, tubelexOccurrenceMap, literaryFrequenciesMap);
    


    mainDataSet = sortWordsByPriority(mainDataSet);
    mainDataSet = maxOutWords(mainDataSet, options);
    mainDataSet = enrichKanjiWithSortingGroup(mainDataSet, options.sortingGroup);
    mainDataSet = enrichWithTargetKanjiReadingType(mainDataSet);
    mainDataSet = await replaceReadingTypes(mainDataSet, PATHS.rawDataDirectoryPath);
    await reportMissingReadingTypes(mainDataSet, PATHS.jsonOutputDirectory);
    

    const svgDataString = await readRawFile(join(PATHS.rawDataDirectoryPath, 'kanjivg-master.json'));
    const svgDataObject = parseJsonToObject(svgDataString);
    mainDataSet = enrichKanjiWithSvg(mainDataSet, svgDataObject);
    

    const jsonFileName = `${options.sortingGroup}-kanji-wizard-dataset.json`;
    await saveToJson(mainDataSet, jsonFileName, PATHS.jsonOutputDirectory);

    await buildTsv(jsonFileName, PATHS.jsonOutputDirectory, PATHS.tsvOutputDirectory, options.sortingGroup);
    
    console.log(`Pipeline complete! Saved ${mainDataSet.length} items.`);
  } catch (error) {
    console.error("Pipeline failure:", error);
    process.exit(1);
  }
}

runPipeline();