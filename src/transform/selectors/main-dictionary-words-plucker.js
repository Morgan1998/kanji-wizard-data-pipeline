export function pluckWords(mainDictObject) {
    if (!mainDictObject || typeof mainDictObject !== 'object') {
        throw new Error('[Plucker Failure] Input must be a valid dictionary object');
    }

    if (!mainDictObject.words || !Array.isArray(mainDictObject.words)) {
        throw new Error('[Extractor Failure] Payload is missing a valid "words" array')
    }

    return [...mainDictObject.words];
}