export function enrichWordsWithFrequency(mainDataSet, wordsFrequencyMap) {
  if (!mainDataSet || !wordsFrequencyMap) {
    throw new Error('[Enricher Failure] Missing data');
  }

  return mainDataSet.map(kanjiEntry => {
    const enrichedWords = kanjiEntry.associatedWords.map(word => {
      const frequency = wordsFrequencyMap.get(word.writtenForm);

      return {
        ...word,
        frequency: frequency || null
      };
    });

    return {
      ...kanjiEntry,
      associatedWords: enrichedWords
    };
  });
}