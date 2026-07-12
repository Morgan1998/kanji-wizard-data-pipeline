export function parseArgs(args) {
  const parsed = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, rawValue] = arg.slice(2).split('=');
      
      if (rawValue) {

        parsed[key] = rawValue.includes(',') 
          ? rawValue.split(',').map(v => v.trim()) 
          : [rawValue];
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}