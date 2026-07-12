import { convertKatakanaToHiragana } from '../../utils/kana-utils.js';
import { getTokenizer } from '../../services/morphology.js';

export async function tokenizeVocab(kanjiWithVocabList) {
  const tokenizer = await getTokenizer();

  return kanjiWithVocabList.map(kanjiWithVocabEntry => {
    const enrichedVocab = kanjiWithVocabEntry.associatedVocab.map(vocabEntry => {
      const tokens = tokenizer.tokenize(vocabEntry.writtenForm) || [];

      const normalizedTokenReading = convertKatakanaToHiragana(
        tokens.map(token => token.reading || '').join('').toLowerCase()
      ).replace(/[\u30fc]/g, '');

      if (!vocabEntry.readings) {
        console.warn('Missing readings for:', vocabEntry.kanji);
      }

      const matchesDictionary = vocabEntry.readings.some(reading => 
        reading.replace(/[\u30fc]/g, '') === normalizedTokenReading
      );

      const useTokenToggle = tokens.length > 1 && matchesDictionary;

      return {
        ...vocabEntry,
        useTokenToggle,
        tokens: tokens.map(token => ({
          surface: token.surface_form,
          reading: useTokenToggle ? token.reading : ''
        }))
      };
    });
    
    return {
      ...kanjiWithVocabEntry,
      associatedVocab: enrichedVocab,
    };
  });
}
