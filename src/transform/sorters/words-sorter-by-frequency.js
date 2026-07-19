export function sortWordsByFrequency(mainDataSet) {
  return mainDataSet.map(kanjiEntry => {
    const sorted = [...kanjiEntry.associatedWords].sort(
      (a, b) => a.frequency - b.frequency
    );

    return {
      ...kanjiEntry,
      associatedWords: sorted
    };
  });
}