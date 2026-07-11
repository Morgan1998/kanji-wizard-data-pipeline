import { runPipeline } from './pipeline.js';

const targetLevel = process.argv[2];

if (!targetLevel) {
  console.error("Usage: node src/index.js <level> (e.g., n4)");
  process.exit(1);
}

runPipeline(targetLevel);



/**
console.log(`Pipeline complete! Found ${dataset.length} kanji.`);
 if (dataset.length > 0) {
  console.log('Sample entry:', JSON.stringify(dataset[0], null, 2));
}
*/