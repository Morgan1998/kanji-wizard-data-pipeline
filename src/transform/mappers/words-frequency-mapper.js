
export function buildWordsFrequencyMap(wordsFrequencyObject) {
    if (!wordsFrequencyObject || !Array.isArray(wordsFrequencyObject)) {
        throw new Error('[Mapper Failure] Frequency Object must be a valid array');
    }

    const wordsFrequencyMap = new Map();
    
    let skippedEntries = 0;
    let noKanjiWords = 0;
    let kanjiWords = 0;
    let totalEntries = 0;
    

    for (const entry of wordsFrequencyObject) {
        totalEntries++;
        if (Array.isArray(entry) && entry.length >= 3) {
            const word = entry[0];
            const metaData = entry [2];

            if (metaData && typeof metaData === 'object' && 'frequency' in metaData) {
                wordsFrequencyMap.set(word, metaData.frequency.value);
                kanjiWords++;
            } else if (metaData && typeof metaData === 'object' && 'value' in metaData) {
                wordsFrequencyMap.set(word, metaData.value);
                noKanjiWords++;
            }
            else {
                skippedEntries++;
                //console.log(`Malformed frequency entry: ${JSON.stringify(entry, null, 2)}`);
            }
        } else {
            skippedEntries++;
            //console.log(`Malformed frequency entry: ${JSON.stringify(entry, null, 2)}`);
        }
    }

    if (skippedEntries > 0 ) {
        console.warn(`[Mapper Warning] Skipped ${skippedEntries} malformed frequency entries.`);
    }

    //console.log(kanjiWords);
    //console.log(noKanjiWords);
    //console.log(`total entries: ${totalEntries}`);
    //console.log(`kanji words plus no kanji words: ${kanjiWords + noKanjiWords}`);

    return wordsFrequencyMap;
}