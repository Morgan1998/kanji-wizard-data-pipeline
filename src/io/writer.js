import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const saveKanjiwithVocabList = (data, filename, outputDirectory) => {

  // Ensure the directory exists
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  const outputPath = join(outputDirectory, filename);
  
  try {
    writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[SUCCESS] Dataset saved to: ${outputPath}`);
  } catch (error) {
    console.error(`[ERROR] Could not save dataset: ${error.message}`);
  }
};