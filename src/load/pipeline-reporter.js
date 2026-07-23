// pipeline-reporter.js
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LLM_PROMPT = `Act as a Japanese linguistics expert and data engineer. I will provide a JSON list of Japanese words. For each object/word, update the 'targetKanjiReadingType' property based on these rules:

1. You will only be concerned with the targetKanji as it appears in the word. You can disregard the readings of the other kanji in the word. 
2. Rendaku: Add 'rendaku' AND the primary reading type ('on' or 'kun') to the array (e.g., ['rendaku', 'on']).
3. Onbin: Add 'onbin' AND the primary reading type ('on' or 'kun') to the array (e.g., ['onbin', 'kun']).
4. Jukujikun: Use exactly ['jukujikun'].
5. Standard: Use ['on'] or ['kun'].
6. Ambiguous: If you are uncertain or it fits none of the above, label it 'manual-review'.

Output Requirements:
- Return the output as a valid JSON object with two keys: "updated" and "flagged".
- You must return the entire original object structure, modifying ONLY the 'targetKanjiReadingType' property AND ONLY removing the 'targetKanji' property. 
- Provide ONLY the raw JSON output. Do not include any conversational filler.
- If you return an entry as flagged, please give follow up recommendations on what we could mark as the targetKanjiReadingType for the flagged entries. 
- Return in a codeblock for easy copying`;

export async function reportMissingReadingTypes(mainDataSet, jsonOutputDirectory) {
    const manualReviewList = [];

    mainDataSet.forEach(kanjiEntry => {
        kanjiEntry.associatedWords.forEach(word => {
            if (!word.targetKanjiReadingType) {
                console.log("Found a word without targetKanjiReadingType:", word.writtenForm, word.id);
            }
            if (word.targetKanjiReadingType.length === 0) {
                manualReviewList.push({
                    "writtenForm": word.writtenForm,
                    "id": word.id,
                    "readings": word.readings,
                    "targetKanjiReadingType": word.targetKanjiReadingType,
                    "targetKanji": kanjiEntry.kanji
                });
            }
        });
    });

    if (manualReviewList.length > 0) {
        const outputDir = jsonOutputDirectory;
        await mkdir(outputDir, { recursive: true });
        const filePath = join(outputDir, 'deck-words-needing-manual-review.json');

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