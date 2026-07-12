import fs from 'fs';

export function createJlptMap(filePath) {
    const rawData = JSON.parse(
    fs.readFileSync(filePath, 'utf-8')
    );

    const jlptMap = new Map();

    for (const [word, entries] of Object.entries(rawData)) {
        if (Array.isArray(entries) && entries.length > 0) {
            jlptMap.set(word, entries[0].level);
        }
    }

    return jlptMap;
}