// pipeline-reporter.js
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LLM_PROMPT = `Act as an expert Japanese linguist and data engineer. I will provide a JSON payload containing an array of Japanese words that need their target kanji reading types classified. 

Each object in the array represents a word paired with a specific 'targetKanji'. Your job is to determine how that specific 'targetKanji' functions *within that exact word*. Please only refer to the first reading of the word in the readings array when applying the rules below.

### Classification Rules:
1. Standard Readings: Use ['on'] or ['kun'] if the target kanji straightforwardly uses its Sino-Japanese (*on'yomi*) or native (*kun'yomi*) reading.
2. Sound Shifts: If the reading undergoes a predictable phonetic mutation, combine the primary type with the modifier:
   - Rendaku (voicing): ['kun', 'rendaku'] or ['on', 'rendaku']
   - Onbin (sound euphony/contraction): ['kun', 'onbin'] or ['on', 'onbin']
3. Jukujikun: If the word is an un-segmentable native compound where individual character readings do not map cleanly to the parts, use ['jukujikun'].
4. Manual Review / Uncertain: If you are uncertain or the reading cannot be reliably attributed to the target kanji, just leave that word object out of the final "updated" array, and instead just add it to the "flagged" array as described in the below 'Output Requirements' section. 

### Output Requirements:
- Return the output as a valid JSON object with two keys: "updated" and "flagged".
- "updated": An array of the processed word objects with the 'targetKanjiReadingType' property updated according to the rules above.
- "flagged": An array of any entries you couldn't classify with high confidence, including a short recommended fix in the object if possible under the property name 'recommendedFix'.
- You must preserve the original object structure, including the 'targetKanji' property so the entries remain contextually anchored.
- Provide ONLY the raw JSON output inside a markdown code block. Do not include any conversational filler or introductory text.`;

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