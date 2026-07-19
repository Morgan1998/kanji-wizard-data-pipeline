export function enrichWordsWithJlpt(mainDataSet, wordsJlptMap) {
  return mainDataSet.map(kanjiEntry => {
    const enrichedWords = kanjiEntry.associatedWords.map(word => {
      const level = wordsJlptMap.get(word.writtenForm);

      return {
        ...word,
        jlptLevel: level || null
      };
    });

    return {
      ...kanjiEntry,
      associatedWords: enrichedWords
    };
  });
}