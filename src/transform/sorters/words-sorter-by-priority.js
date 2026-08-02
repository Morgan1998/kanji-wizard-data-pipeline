export function sortWordsByPriority(mainDataSet) {
    if (!Array.isArray(mainDataSet)) return [];

    return mainDataSet.map((entry) => {
        const words = entry.associatedWords;

        if (!Array.isArray(words)) {
            return entry;
        }

        // Phase 1: Spoken frequency (Lower number = higher priority)
        const phase1 = words
            .filter(word => word.spokenFrequency !== undefined && word.spokenFrequency !== null)
            .sort((a, b) => a.spokenFrequency - b.spokenFrequency);

        const sortedIds = new Set(phase1.map(w => w.id));

        // Phase 2: Tubelex occurrence count (Higher number = higher priority)
        const phase2 = words
            .filter(word => !sortedIds.has(word.id) && word.tubelexOccurrenceCount !== undefined && word.tubelexOccurrenceCount !== null)
            .sort((a, b) => b.tubelexOccurrenceCount - a.tubelexOccurrenceCount);

        phase2.forEach(w => sortedIds.add(w.id));

        // Phase 3: Literary frequency (Lower number = higher priority)
        const phase3 = words
            .filter(word => !sortedIds.has(word.id) && word.literaryFrequency !== undefined && word.literaryFrequency !== null)
            .sort((a, b) => a.literaryFrequency - b.literaryFrequency);

        phase3.forEach(w => sortedIds.add(w.id));

        // Phase 4: Everything else
        const phase4 = words
            .filter(word => !sortedIds.has(word.id));

        return {
            ...entry,
            associatedWords: [...phase1, ...phase2, ...phase3, ...phase4]
        };
    });
}