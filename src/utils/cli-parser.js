export function parseArgs(args) {
  const parsed = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, rawValue] = arg.slice(2).split('=');
      
      if (rawValue !== undefined) {
        // Handle Booleans
        if (rawValue.toLowerCase() === 'true') parsed[key] = true;
        else if (rawValue.toLowerCase() === 'false') parsed[key] = false;
        
        // Handle Lists (Comma-separated)
        else if (rawValue.includes(',')) {
          parsed[key] = rawValue.split(',').map(v => v.trim());
        } 
        
        // Handle single values: FORCE THEM INTO AN ARRAY
        // This is the fix for your filter error
        else {
          parsed[key] = [rawValue]; 
        }
      } else {
        // Flag with no value
        parsed[key] = true;
      }
    }
  }
  return parsed;
}