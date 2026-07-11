import { getKanjiByLevel } from './kanjiLoader.js';
import { getVocabList } from './vocabLoader.js';
import { saveDataset } from './writer.js';
import { getTokenizer } from './morphology.js';


function katakanaToHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

export async function runPipeline(targetLevel) {
  try {
    console.log(`--- Running Pipeline for ${targetLevel.toUpperCase()} ---`);
    
    console.log("Loading dictionary...");
    const tokenizer = await getTokenizer();
    
    const kanjiData = getKanjiByLevel(targetLevel);
    const vocabData = getVocabList(targetLevel);

    console.log("Analyzing vocabulary...");
    const processedVocab = vocabData.map(vocab => {
      const tokens = tokenizer.tokenize(vocab.writtenForm);
      
      // 1. Join all token readings and normalize to Hiragana
      const combinedReading = tokens
        .map(t => t.reading)
        .join('')
        .toLowerCase(); // Ensure consistent case
        
      const normalizedTokenReading = katakanaToHiragana(combinedReading);
      
      // 2. Compare against the provided vocabulary reading (normalized)
      // We check if it exists in the provided readings array
      const matchesDictionary = vocab.readings.some(r => 
        r.replace(/[\u30fc]/g, '') === normalizedTokenReading.replace(/[\u30fc]/g, '')
      );

      // 3. Logic: Only toggleable if split > 1 AND it matches the dictionary
      const isToggleable = tokens.length > 1 && matchesDictionary;

      return {
        ...vocab,
        isToggleable,
        tokens: tokens.map(t => ({ surface: t.surface_form, reading: t.reading }))
      };
    });

    // 4. Map kanji to the processed vocab
    const dataset = kanjiData.map(([kanjiCharacter, data]) => {
      return {
        kanji: kanjiCharacter,
        ...data,
        associatedVocab: processedVocab.filter(vocab => 
          vocab.writtenForm.includes(kanjiCharacter)
        )
      };
    });

    saveDataset(dataset, `processed-${targetLevel}-data.json`);
    console.log("Pipeline complete.");
    
  } catch (err) {
    console.error("Critical error in pipeline execution:", err);
    throw err; 
  }
}