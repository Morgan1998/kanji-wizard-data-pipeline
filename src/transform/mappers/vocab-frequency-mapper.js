import fs from 'fs';

export function createFrequencyMap(filePath) {
    const rawData = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
    );

    const frequencyMap = new Map();

    // The JPDB structure is an array of entries: ["word", "type", detailsObject]
    for (const entry of rawData) {
        const [word, , details] = entry;
        
        // Safely store the frequency value
        if (details?.frequency?.value !== undefined) {
            frequencyMap.set(word, details.frequency.value);
        }
    }

    return frequencyMap;
}