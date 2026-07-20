import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function replaceReadingTypes(mainDataSet, rawDataDirectoryPath, level) {
    let overrides = [];
    
    try {
        const filePath = join(rawDataDirectoryPath, `n${level}-reading-type-overrides.json`);
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

    const overrideMap = new Map(overrides.map(word => [word.id, word]));

    return mainDataSet.map(entry => ({
        ...entry,
        associatedWords: entry.associatedWords.map(word => {
            if (overrideMap.has(word.id)) {
                const patch = overrideMap.get(word.id);
                return {
                    ...word,
                    readingType: patch.readingType
                };
            }
            return word;
        })
    }));
}