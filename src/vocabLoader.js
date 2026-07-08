import { readFileSync } from 'fs';
import { join } from 'path';

const currentDirectory = import.meta.dirname;

/**
 * Loads vocabulary data from the raw JSON source.
 * @returns {Array} An array of vocabulary objects.
 */
export const getVocabList = () => {
  const filePath = join(currentDirectory, '../data/raw/n4-vocab.json');
  
  try {
    const rawData = readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`[ERROR] Failed to load vocabulary list: ${error.message}`);
    return [];
  }
};