import { readFileSync } from 'fs';
import { join } from 'path';

const currentDirectory = import.meta.dirname;

/**
 * Loads and optionally filters vocabulary data.
 * @param {string} [level] - Optional: The JLPT level to filter by (e.g., 'n4')
 */
export const getVocabList = (level = null) => {
  const filePath = join(currentDirectory, '../data/raw/n4-vocab.json'); // Assume a master file
  
  try {
    const rawData = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // If no level is provided, return everything. 
    // If a level IS provided, filter it.
    if (!level) return rawData;
    
    return rawData.filter(word => word.level.toLowerCase() === level.toLowerCase());
  } catch (error) {
    console.error(`[ERROR] Failed to load vocabulary list: ${error.message}`);
    return [];
  }
};