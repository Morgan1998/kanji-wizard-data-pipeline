export function normalizeKanjiData(kanjiDataObject) {
    if (!kanjiDataObject || typeof kanjiDataObject !== 'object' || Array.isArray(kanjiDataObject)) {
        throw new Error('[Normalizer Failure] Input must be a valid Kanji object dictionary');
    }

    return Object.entries(kanjiDataObject).map(([kanji, data]) => {
        const safeData = data && typeof data === 'object' ? data : { value: data };

        return {
            kanji: kanji,
            ...safeData
        }
    });
}