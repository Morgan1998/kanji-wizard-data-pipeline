
export function filterPluckedWordsArray(mainDictPluckedWordsArray) {
  return mainDictPluckedWordsArray.words.flatMap((vocabularyEntry) => {
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
}
