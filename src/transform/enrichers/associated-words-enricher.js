/**
 * Enriches a dataset of Kanji objects with associated words/vocabulary.
 * Uses a Map-based lookup for O(N+M) performance.
 * 
 * @param {Array} mainDataSet - Array of kanji objects.
 * @param {Map} wordsMap - Pre-built Map of kanji characters to vocab entries.
 * @returns {Array} The enriched dataset with an 'associatedWords' field.
 */
export function enrichWithAssociatedWords(mainDataSet, wordsMap) {
    return mainDataSet.map(kanjiEntry => ({
        ...kanjiEntry,
        associatedWords: wordsMap.get(kanjiEntry.kanji) || []
    }));
}
