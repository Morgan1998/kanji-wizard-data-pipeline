export function filterByLevel(data, level) {
    if (!Array.isArray(data)) {
        throw new Error('[Filter Failure] Data provided to level-filterer must be an array');
    }

    return data.filter((kanjiEntry) => kanjiEntry?.jlpt?.toLowerCase() === level);
}
