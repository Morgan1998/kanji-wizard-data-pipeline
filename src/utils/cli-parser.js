// src/utils/cli-parser.js
export function parseArgs(args) {
  const parsed = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      parsed[key] = value.includes(',') 
        ? value.split(',').map(v => v.trim()) 
        : value;
    }
  }
  return parsed;
}