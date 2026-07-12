import { convertKatakanaToHiragana } from '../../utils/kana-utils.js';
import { getTokenizer } from '../../services/morphology.js';

export async function tokenizeVocab(kanjiList) {
  const tokenizer = await getTokenizer();

  return kanjiList.map(vocabEntry => {
    console.log(vocabEntry.writtenForm);
    if (!vocabEntry.writtenForm || typeof vocabEntry.writtenForm !== 'string') {
      return { ...vocabEntry, useTokenToggle: false, tokens: [] };
    }

    const tokens = tokenizer.tokenize(vocabEntry.writtenForm) || [];

    const normalizedTokenReading = convertKatakanaToHiragana(
      tokens.map(token => token.reading || '').join('').toLowerCase()
    ).replace(/[\u30fc]/g, '');

    const matchesDictionary = vocabEntry.readings.some(reading => 
      reading.replace(/[\u30fc]/g, '') === normalizedTokenReading
    );


    const useTokenToggle = tokens.length > 1 && matchesDictionary;

    return {
      ...vocabEntry,
      useTokenToggle,
      tokens: tokens.map(token => ({
        surface: token.surface_form,
        reading: useTokenToggle ? token.reading : ""
      }))
    };
  });
}