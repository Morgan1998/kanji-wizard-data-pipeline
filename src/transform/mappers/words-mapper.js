/**
 * Transforms dictionary entries into a Map for O(1) lookup.
 */
export function buildWordsMap(filteredPluckedWordsArray) {
    const wordsMap = new Map();
    const kanjiRegex = /[\u4e00-\u9faf]/g;

    for (const entry of filteredPluckedWordsArray) {
        const chars = [...new Set(entry.writtenForm.match(kanjiRegex) || [])];
        
        for (const char of chars) {
            if (!wordsMap.has(char)) wordsMap.set(char, []);
            wordsMap.get(char).push(entry);
        }
    }
    return wordsMap;
}