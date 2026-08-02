import fs from 'node:fs';
import readline from 'node:readline';

export async function buildTubelexOccurrencesMap(filePath) {
    const occurrenceMap = new Map();
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;

    for await (const line of rl) {
        // Skip the header row if the TSV has one
        if (isFirstLine) {
            isFirstLine = false;
            continue;
        }

        const columns = line.split('\t');
        const word = columns[0];
        const rawCount = columns[1];

        if (word && rawCount) {
            const count = parseInt(rawCount, 10);
            if (!isNaN(count)) {
                // TUBELEX gives raw occurrence counts. 
                // Higher count = more frequent.
                occurrenceMap.set(word, count);
            }
        }
    }

    return occurrenceMap;
}