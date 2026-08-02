import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function replaceReadingTypes(mainDataSet, rawDataDirectoryPath) {
    let overrides = [];
    
    try {
        const filePath = join(rawDataDirectoryPath, 'reading-type-overrides', 'reading-type-overrides.json');
        const data = await readFile(filePath, 'utf-8');
        overrides = JSON.parse(data);
    } catch (error) {
        console.log('No reading-type-overrides.json found, skipping patch phase.');
        return mainDataSet;
    }

    if (overrides.length === 0) {
        console.log('reading-type-overrides.json is empty. No replacing needed! woohoo!');
        return mainDataSet;
    }

    // Build a composite map using both the word id and target kanji as the key
    const overrideMap = new Map(
        overrides.map(item => [`${item.id}_${item.targetKanji}`, item])
    );

    return mainDataSet.map(entry => {
        const targetKanji = entry.kanji; // Assumes each mainDataSet entry holds the target kanji property

        return {
            ...entry,
            associatedWords: entry.associatedWords.map(word => {
                const compositeKey = `${word.id}_${targetKanji}`;
                
                if (overrideMap.has(compositeKey)) {
                    const patch = overrideMap.get(compositeKey);
                    return {
                        ...word,
                        targetKanjiReadingType: patch.targetKanjiReadingType
                    };
                }
                return word;
            })
        };
    });
}