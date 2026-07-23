// enrichers.js


export function enrichWithCoreKanjiData(mainDataSet, kanjiDataDictionary) {
    return mainDataSet.map(kanjiEntry => {
        const kanjiCharacter = kanjiEntry.kanji;
        const extraData = kanjiDataDictionary[kanjiCharacter];

        if (!extraData) {
            console.warn(`[Warning] Kanji "${kanjiCharacter}" not found in external kanji-data dictionary.`);
            return kanjiEntry;
        }

        return {
            kanji: kanjiCharacter,
            strokes: extraData.strokes,
            grade: extraData.grade,
            freq: extraData.freq,
            jlpt: extraData.jlpt_new,
            meanings: extraData.meanings,
            on_readings: extraData.readings_on,
            kun_readings: extraData.readings_kun,
        };
    });
}