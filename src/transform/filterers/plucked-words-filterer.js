
export function filterPluckedWords(pluckedWords) {
  return pluckedWords.flatMap((word) => {
    const commonKanjiForms = word.kanji.filter(
      (kanjiForm) => kanjiForm.common === true
    );

    if (commonKanjiForms.length === 0) {
      return [];
    }

    return commonKanjiForms.map((kanjiForm) => {
      const relevantReadings = word.kana.filter((readingEntry) => {
        return (
          readingEntry.appliesToKanji.includes("*") || 
          readingEntry.appliesToKanji.includes(kanjiForm.text)
        );
      });

      return {
        writtenForm: kanjiForm.text,
        id: word.id,
        readings: relevantReadings.map((reading) => reading.text),
        glosses: word.sense.flatMap((sense) => 
          sense.gloss.map((gloss) => gloss.text)
        )
      };
    });
  });
}
