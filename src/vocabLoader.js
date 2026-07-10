import { readFileSync } from 'fs';
import { join } from 'path';

const currentDirectory = import.meta.dirname;

export const getVocabList = () => {
  const filePath = join(currentDirectory, '../data/raw/jmdict-eng-common-3.6.2.json');
  
  try {
    const rawData = JSON.parse(readFileSync(filePath, 'utf8'));
    
    return rawData.words.flatMap((vocabularyEntry) => {
      const commonKanjiForms = vocabularyEntry.kanji.filter(
        (kanjiForm) => kanjiForm.common === true
      );

      if (commonKanjiForms.length === 0) {
        return [];
      }

      return commonKanjiForms.map((kanjiForm) => {
        const relevantReadings = vocabularyEntry.kana.filter((readingEntry) => {
          return (
            readingEntry.appliesToKanji.includes("*") || 
            readingEntry.appliesToKanji.includes(kanjiForm.text)
          );
        });

        return {
          writtenForm: kanjiForm.text,
          id: vocabularyEntry.id,
          readings: relevantReadings.map((reading) => reading.text),
          glosses: vocabularyEntry.sense.flatMap((sense) => 
            sense.gloss.map((gloss) => gloss.text)
          )
        };
      });
    });
  } catch (error) {
    console.error(`[ERROR] Failed to process JMDICT: ${error.message}`);
    return [];
  }
};