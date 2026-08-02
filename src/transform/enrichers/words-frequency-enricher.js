export function enrichWordsWithFrequency(mainDataSet, spokenFrequenciesMap, tubelexOccurrenceMap, literaryFrequenciesMap) {
  if (!mainDataSet || !spokenFrequenciesMap || !tubelexOccurrenceMap || !literaryFrequenciesMap) {
    throw new Error('[Enricher Failure] Missing data');
  }

  return mainDataSet.map(kanjiEntry => {
    const enrichedWords = kanjiEntry.associatedWords.map(word => {
      const spokenFrequency = spokenFrequenciesMap.get(word.writtenForm);
      const tubelexOccurrenceCount = tubelexOccurrenceMap.get(word.writtenForm);
      const literaryFrequency = literaryFrequenciesMap.get(word.writtenForm);

      return {
        ...word,
        spokenFrequency: spokenFrequency || null,
        tubelexOccurrenceCount: tubelexOccurrenceCount || null,
        literaryFrequency: literaryFrequency || null
      };
    });

    return {
      ...kanjiEntry,
      associatedWords: enrichedWords
    };
  });
}