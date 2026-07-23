
function validateLineBreakData(rawString) {
    const lines = rawString.split(/\r?\n/);
    
    for (const [i, line] of lines.entries()) {
    
        if (line === '') continue; 
    
        if (line.length !== 1 || !/\p{Script=Han}/u.test(line)) {
            throw new Error(`[Schema Error] Line ${i + 1} ("${line}") is invalid. Must be a single kanji with no extra characters or double line breaks.`);
        }
    }
}

function validateJsonData(parsedObj) {
    if (!Array.isArray(parsedObj)) {
        throw new Error('[Schema Error] JSON root must be an array.');
    }

    for (const [i, item] of parsedObj.entries()) {
        const keys = Object.keys(item);

        if (typeof item !== 'object' || item === null || keys.length !== 1 || keys[0] !== 'kanji') {
            throw new Error(`[Schema Error] Entry at index ${i} is malformed. Must contain ONLY the "kanji" property.`);
        }

        if (typeof item.kanji !== 'string' || item.kanji.length === 0) {
            throw new Error(`[Schema Error] Entry at index ${i} has an invalid "kanji" value.`);
        }
    }
}

// 2. The Parsers
const registry = {
    json: (rawString) => {
        const parsed = JSON.parse(rawString);
        validateJsonData(parsed);
        return parsed;
    },
    
    linebreak: (rawString) => {
        validateLineBreakData(rawString); // Guard check
        return rawString
            .split(/\r?\n/)
            .filter(line => line.trim().length > 0)
            .map(line => ({ kanji: line.trim()}));
    }
};


function detectFormat(rawString) {
    const trimmed = rawString.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        return 'json';
    }
    return 'linebreak';
}

export function parseDataset(rawString) {
    const formatKey = detectFormat(rawString);
    const parserFn = registry[formatKey];
    
    if (!parserFn) {
        throw new Error(`Unsupported dataset format detected: ${formatKey}`);
    }
    
    console.log(`[Pipeline] Format detected: ${formatKey}. Running validation and parser...`);
    return parserFn(rawString);
}