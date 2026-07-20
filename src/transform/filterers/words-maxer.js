
export function maxOutWords(mainDataSet, options) {
  const max = parseInt(options?.maxWords) || 5;

  return mainDataSet.map(kanjiEntry => {
    if (max < kanjiEntry.associatedWords.length) {
      const maxedOut = [...kanjiEntry.associatedWords]
        .slice(0, max);
      return {
        ...kanjiEntry,
        associatedWords: maxedOut
      };
    } else {
      return kanjiEntry
    }
  });
}