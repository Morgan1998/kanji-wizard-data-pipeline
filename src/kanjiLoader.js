import { readFileSync } from 'fs';
import { join } from 'path';

const currentDirectory = import.meta.dirname;

const filePath = join(currentDirectory, '../data/raw/kanji_jlpt_only.json');
const rawData = JSON.parse(readFileSync(filePath, 'utf8'));

const LEVEL_MAP = { 'n5': 5, 'n4': 4, 'n3': 3, 'n2': 2, 'n1': 1 };

/**
 * Loads and filters kanji data by JLPT level.
 * @param {string} targetLevel - The level, e.g., 'n4'
 */
export const getKanjiByLevel = (targetLevel) => {
  const levelKey = targetLevel?.toLowerCase();
  const level = LEVEL_MAP[levelKey];

  if (!level) {
    throw new Error(`Invalid JLPT level provided: ${targetLevel}`);
  }

  return Object.values(rawData).filter(entry => entry.jlpt === level);
};
