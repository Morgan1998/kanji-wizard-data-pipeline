export function assignJlptLevelToAssociatedVocab(kanjiWithVocabList, jlptMap) {
  return kanjiWithVocabList.map(function(kanjiWithVocabEntry) {
    const enrichedVocab = kanjiWithVocabEntry.associatedVocab.map(function(vocabEntry) {
      const level = jlptMap.get(vocabEntry.writtenForm);

      return {
        ...vocabEntry,
        jlptLevel: level || null
      };
    });

    return {
      ...kanjiWithVocabEntry,
      associatedVocab: enrichedVocab
    };
  });
}