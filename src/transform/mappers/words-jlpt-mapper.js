export function buildWordsJlptMap(wordsJlptObject) {
    if (!wordsJlptObject || typeof wordsJlptObject !== 'object') {
        throw new Error('[Mapper Failure] Input must be a valid object');
    }

    const wordsJlptMap = new Map();
    const missingEntries = []; 

    for (const [word, entries] of Object.entries(wordsJlptObject)) {
        if (Array.isArray(entries) && entries.length > 0) {
            wordsJlptMap.set(word, entries[0].level);
        } else {
            missingEntries.push(word);
        }
    }

    if (missingEntries.length > 0) {
        console.warn(`[Mapper Warning] ${missingEntries.length} words were missing entries:`, missingEntries);
    }

    return wordsJlptMap;
}