export function assignFrequencyToVocab(kanjiWithVocabList, frequencyMap) {
  return kanjiWithVocabList.map(kanjiWithVocabEntry => {
    const enrichedVocab = kanjiWithVocabEntry.associatedVocab.map(vocabEntry => {
      const frequency = frequencyMap.get(vocabEntry.writtenForm);

      return {
        ...vocabEntry,
        frequency: frequency || null
      };
    });

    return {
      ...kanjiWithVocabEntry,
      associatedVocab: enrichedVocab
    };
  });
}