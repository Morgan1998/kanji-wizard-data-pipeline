import { parseArgs } from './utils/cli-parser.js';
import { runPipeline } from './pipeline.js';

const args = parseArgs(process.argv.slice(2));

let targetLevels = args.levels || ['n5', 'n4', 'n3', 'n2', 'n1'];

const VALID_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

const invalidLevels = targetLevels.filter(level => !VALID_LEVELS.includes(level));

if (invalidLevels.length > 0) {
  console.error(`Error: Invalid JLPT level(s) provided: ${invalidLevels.join(', ')}`);
  console.error(`Accepted values are: ${VALID_LEVELS.join(', ')}`);
  process.exit(1); 
}

await runPipeline(targetLevels);
