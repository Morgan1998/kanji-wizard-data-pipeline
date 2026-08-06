import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Reconstruct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This resolves to the "../data/raw/kanji.json" directory relative to this script
const SOURCE_FILE_NAME = 'kanji.json'; 
const sourcePath = path.join(__dirname, '..', 'data', 'raw', SOURCE_FILE_NAME);

try {
  // Check if source file exists asynchronously
  try {
    await fs.access(sourcePath);
  } catch {
    throw new Error(`Source file "${SOURCE_FILE_NAME}" not found in this folder. Please verify the filename.`);
  }

  // Read and parse the source database
  const rawData = await fs.readFile(sourcePath, 'utf8');
  const kanjiData = JSON.parse(rawData);

  // Initialize buckets for each JLPT level (1 to 5)
  const buckets = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  // Populate buckets using modern optional chaining
  for (const [kanji, info] of Object.entries(kanjiData)) {
    if (info?.jlpt_new !== undefined) {
      const level = parseInt(info.jlpt_new, 10);
      if (level >= 1 && level <= 5) {
        buckets[level].push(kanji);
      }
    }
  }

  // Write files concurrently using Promise.all
  const writePromises = Object.entries(buckets).map(async ([level, kanjiList]) => {
    const fileName = `n${level}.txt`;
    const filePath = path.join(__dirname, fileName);
    const txtContent = kanjiList.join('\n');

    await fs.writeFile(filePath, txtContent, 'utf8');
    console.log(`Created ${fileName} (${kanjiList.length} kanji)`);
  });

  await Promise.all(writePromises);
  console.log('Task complete.');

} catch (error) {
  console.error('Error processing the kanji data:', error.message);
}