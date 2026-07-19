import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function saveToJson(mainDataSet, filename, outputDirectory) {
  await mkdir(outputDirectory, { recursive: true });

  const outputPath = join(outputDirectory, filename);
  
  try {
    await writeFile(outputPath, JSON.stringify(mainDataSet, null, 2), 'utf8');
    console.log(`[SUCCESS] Dataset saved to: ${outputPath}`);
  } catch (error) {
    console.error(`[ERROR] Could not save dataset: ${error.message}`);
    throw error; 
  }
}