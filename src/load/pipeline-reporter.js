// pipeline-reporter.js
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LLM_PROMPT = `Act as a Japanese linguistics expert and data engineer. I will provide a JSON list of Japanese words. For each object, update the 'readingType' property based on these rules:

1. Rendaku: Add 'rendaku' AND the primary reading type ('on' or 'kun') to the array (e.g., ['rendaku', 'on']).
2. Onbin: Add 'onbin' AND the primary reading type ('on' or 'kun') to the array (e.g., ['onbin', 'kun']).
3. Jukujikun: Use exactly ['jukujikun'].
4. Standard: Use ['on'] or ['kun'].
5. Ambiguous: If you are uncertain or it fits none of the above, label it 'manual-review'.

Output Requirements:
- Return the output as a valid JSON object with two keys: "updated" and "flagged".
- You must return the entire original object structure, modifying ONLY the 'readingType'.
- Provide ONLY the raw JSON output. Do not include any conversational filler.`;

export async function reportMissingReadingTypes(mainDataSet, level, jsonOutputDirectory) {
    const manualReviewList = [];

    mainDataSet.forEach(entry => {
        entry.associatedWords.forEach(word => {
            if (!word.readingType) {
                console.log("Found a word without readingType:", word.writtenForm, word.id);
            }
            if (word.readingType.length === 0) {
                manualReviewList.push({
                    "writtenForm": word.writtenForm,
                    "id": word.id,
                    "readings": word.readings,
                    "readingType": word.readingType
                });
            }
        });
    });

    if (manualReviewList.length > 0) {
        const outputDir = jsonOutputDirectory;
        await mkdir(outputDir, { recursive: true });
        const filePath = join(outputDir, `n${level}-deck-words-needing-manual-review.json`);

        const outputPayload = {
            instruction: LLM_PROMPT,
            words: manualReviewList
        };
        
        await writeFile(filePath, JSON.stringify(outputPayload, null, 2), 'utf-8');
        console.log(`Pipeline: ${manualReviewList.length} words flagged for manual reading type review in ${filePath}`);
    } else {
        console.log('Awesome! All words have a reading type listed. No manual review needed!');
    }
}