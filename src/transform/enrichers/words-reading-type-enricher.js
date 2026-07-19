import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { convertKatakanaToHiragana } from "#utils/kana-utils";

export function enrichWithReadingType(mainDataSet) {

    const enrichedDataSet = mainDataSet.map((entry) => ({
        ...entry,
        associatedWords: entry.associatedWords.map((word) => {
            const rawReadings = Array.isArray(word.readings) ? word.readings : [word.readings];
            const wordReading = rawReadings[0] || "";

            const normalize = (reading) => convertKatakanaToHiragana(reading.replace(/\./g, ""));
            
            const cleanKun = entry.kun_readings.map(normalize);
            const cleanOn = entry.on_readings.map(normalize);

            let types = [];
            
            if (cleanKun.some((kun) => wordReading.includes(kun))) {
            types.push("kun");
            }
            if (cleanOn.some((on) => wordReading.includes(on))) {
            types.push("on");
            }

            return { ...word, readingType: types };
        }),
    }));

    return enrichedDataSet;
}