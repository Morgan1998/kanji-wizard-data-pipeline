export function filterByLevel(kanjiDataArray, level) {
  if (!Array.isArray(kanjiDataArray)) {
    throw new Error('[Filter Failure] Data provided to level-filterer must be an array');
  }
  if (!level) return kanjiDataArray;
  if (typeof level !== 'number');



  return kanjiDataArray.filter((kanjiEntry) => {
    const jlpt = kanjiEntry?.jlpt;

    return jlpt && typeof jlpt === 'number' && jlpt === level;
  });
}