import { readFileSync } from 'fs';
import { join } from 'path';

const currentDirectory = import.meta.dirname;
const filePath = join(currentDirectory, '../../../data/raw/kanji_jlpt_only.json');
const rawData = JSON.parse(readFileSync(filePath, 'utf8'));

const LEVEL_MAP = { 'n5': 5, 'n4': 4, 'n3': 3, 'n2': 2, 'n1': 1 };

/**
 * Loads and filters kanji data by JLPT level(s).
 * @param {string|string[]} targetLevels - A single level or an array of levels, e.g., 'n4' or ['n1', 'n3']
 */
export const getKanjiByLevel = (targetLevelsArray) => {

  const allowedLevels = targetLevelsArray.map(level => {
    const numericLevel = LEVEL_MAP[level?.toLowerCase()];
    if (!numericLevel) {
      throw new Error(`Invalid JLPT level provided: ${level}`);
    }
    return numericLevel;
  });

  return Object.entries(rawData).filter(([kanji, data]) => 
    allowedLevels.includes(data.jlpt)
  );
};
