import { convertKatakanaToHiragana } from '../../utils/kana-utils.js';

export function tokenizeVocabList(vocabularyList, tokenizer) {
  return vocabularyList.map(vocabularyEntry => {
    const tokens = tokenizer.tokenize(vocabularyEntry.writtenForm);
    
    // Logic for token normalization and matching...
    const normalizedTokenReading = convertKatakanaToHiragana(
      tokens.map(token => token.reading).join('').toLowerCase()
    );
    
    const matchesDictionary = vocabularyEntry.readings.some(dictionaryReading => 
      dictionaryReading.replace(/[\u30fc]/g, '') === normalizedTokenReading.replace(/[\u30fc]/g, '')
    );

    const useTokenToggle = tokens.length > 1 && matchesDictionary;

    return {
      ...vocabularyEntry,
      useTokenToggle: useTokenToggle,
      tokens: tokens.map(token => ({ 
        surface: token.surface_form, 
        reading: useTokenToggle ? token.reading : "" 
      }))
    };
  });
}