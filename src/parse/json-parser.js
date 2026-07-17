export function parseJsonToObject(rawJsonString) {
    if (!rawJsonString || rawJsonString.trim() === '') {
        throw new Error('[Parser Failure] Cannot process an empty or undefined JSON resource string');
    }

    try {
        parsedData = JSON.parse(rawJsonString);
        return parsedData;
    } catch (error) {
        throw new Error(`[Parser Failure] Target string is not valid JSON. Structural violation: ${error.message}`);
    }
}