import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

export function buildTsv(jsonDataPath, tsvOutputDirectory) {
    try {
        const rawData = readFileSync(jsonDataPath, 'utf8');
        const kanjiList = JSON.parse(rawData);

        const level = kanjiList[0]?.jlpt || 'unknown'; 
        const filename = `n${level}-kanji-with-vocab.tsv`;
        
        const tsvRows = kanjiList.map(item => {
            const jsonBlob = JSON.stringify(item).replace(/\t/g, '    ');
            return `${item.kanji}\t${jsonBlob}`;
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