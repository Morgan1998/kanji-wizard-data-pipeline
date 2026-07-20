/**
 * Converts a kanji character to its Unicode decimal string key.
 * @param {string} char - The kanji character.
 * @returns {string} The Unicode decimal representation (e.g., '令' -> '20164').
 */
function getUnicodeKey(char) {
    return char.codePointAt(0).toString(16).padStart(5, '0');
}

/**
 * Enriches the mainDataSet with SVG data.
 * @param {Array} mainDataSet 
 * @param {Object} svgDataObject 
 * @returns {Array} 
 */
export function enrichKanjiWithSvg(mainDataSet, svgDataObject) {
    console.log("🎨 Enriching dataset with SVG paths...");

    let unicodeMismatches = 0;

    for (let kanjiEntry of mainDataSet) {
        // 1. Guard against empty kanji
        if (!kanjiEntry.kanji) {
            unicodeMismatches++;
            continue;
        }

        // 2. Get the key
        const key = getUnicodeKey(kanjiEntry.kanji);

        // 3. Check if key exists in the object
        // Using simple undefined check is the fastest way to verify presence
        if (svgDataObject[key] === undefined) {
            unicodeMismatches++;
            console.log(`Mismatch found for: ${kanjiEntry.kanji} (Key: ${key})`);
        }
    }

    console.log(`Total mismatches: ${unicodeMismatches}`);

    return mainDataSet.map(kanjiEntry => ({
        ...kanjiEntry,
        svg: svgDataObject[getUnicodeKey(kanjiEntry.kanji)] || []
    }));
}