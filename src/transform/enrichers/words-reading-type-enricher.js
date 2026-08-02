import { convertKatakanaToHiragana } from "#utils/kana-utils";

function countKanji(str) {
    const kanjiMatches = str.match(/[\u4e00-\u9faf]/g);
    return kanjiMatches ? kanjiMatches.length : 0;
}

export function enrichWithTargetKanjiReadingType(mainDataSet) {
    return mainDataSet.map((entry) => {
        if (!entry.kun_readings || !entry.on_readings) {
            console.warn('missing some kun or on readings');
            return entry;
        }

        const normalize = (reading) => convertKatakanaToHiragana(reading.replace(/\./g, ""));
        const cleanKun = entry.kun_readings.map(normalize);
        const cleanOn = entry.on_readings.map(normalize);

        const enrichedWords = entry.associatedWords.map((word) => {
            if (countKanji(word.writtenForm) > 1) {
                return { 
                    ...word, 
                    targetKanjiReadingType: [] // Or null / empty array based on your preference
                };
            }

            const rawReadings = Array.isArray(word.readings) ? word.readings : [word.readings];
            const wordReading = rawReadings[0] || "";

            let types = [];
            
            if (cleanKun.some((kun) => wordReading.includes(kun))) {
                types.push("kun");
            }
            if (cleanOn.some((on) => wordReading.includes(on))) {
                types.push("on");
            }

            return { ...word, targetKanjiReadingType: types };
        });

        return {
            ...entry,
            associatedWords: enrichedWords
        };
    });
}