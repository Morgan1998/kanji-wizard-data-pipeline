
export function filterAndSortVocab(kanjiWithVocabList, maxVocabCount) {
  return kanjiWithVocabList.map(kanjiWithVocabEntry => {
    const sortedAndLimited = [...kanjiWithVocabEntry.associatedVocab]
      .filter(vocab => vocab.frequency !== null) 
      .sort((a, b) => a.frequency - b.frequency)
      .slice(0, maxVocabCount);

    return {
      ...kanjiWithVocabEntry,
      associatedVocab: sortedAndLimited
    };
  });
}