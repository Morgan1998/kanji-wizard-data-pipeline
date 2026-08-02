export function enrichKanjiWithSortingGroup(mainDataSet, sortingGroup) {
    console.log(`🏷️ Adding 'sortingGroup' property with value "${sortingGroup}" to dataset entries...`);

    return mainDataSet.map(kanjiEntry => ({
        ...kanjiEntry,
        sortingGroup: sortingGroup || "default"
    }));
}