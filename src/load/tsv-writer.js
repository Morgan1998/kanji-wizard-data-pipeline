import { PATHS } from '#config/constants';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

export function buildTsv(jsonFileName, jsonOutputDirectory, tsvOutputDirectory, arrangedBy) {
    try {
        const jsonPath = join(jsonOutputDirectory, jsonFileName)
        const rawData = readFileSync(jsonPath, 'utf8');
        const kanjiData = JSON.parse(rawData);

        const filename = `${arrangedBy}-kanji-wizard.tsv`;
        
        const tsvRows = kanjiData.map(kanjiEntry => {
            const jsonBlob = JSON.stringify(kanjiEntry).replace(/\t/g, '    ');
            return `${kanjiEntry.kanji}\t${jsonBlob}`;
        });

        const outputDir = tsvOutputDirectory;
        const outputPath = join(outputDir, filename);
        
        mkdirSync(outputDir, { recursive: true });

        // 4. Write the file
        writeFileSync(outputPath, tsvRows.join('\n'));
        
        console.log(`TSV successfully generated at: ${outputPath}`);
    } catch (err) {
        console.error('Pipeline Error:', err);
    }
}