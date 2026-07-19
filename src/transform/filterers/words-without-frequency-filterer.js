export function filterWordsWithoutFrequency(mainDataSet) {
  return mainDataSet.map(kanjiEntry => {
    return {
      ...kanjiEntry,
      associatedWords: kanjiEntry.associatedWords.filter(
        word => word.frequency !== null
      )
    };
  });
}