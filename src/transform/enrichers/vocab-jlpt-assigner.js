export function assignJlptLevelToVocab(kanjiWithVocabList, jlptMap) {
  return kanjiWithVocabList.map(kanjiWithVocabEntry => {
    const enrichedVocab = kanjiWithVocabEntry.associatedVocab.map(vocabEntry => {
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