export function convertKatakanaToHiragana(katakanaString) {
  return katakanaString.replace(/[\u30a1-\u30f6]/g, match => {
    const charCode = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(charCode);
  });
}