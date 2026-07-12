    
export function assignAssociatedVocab(kanjiList, vocabularyList) {
    return kanjiList.map(([kanjiCharacter, kanjiMetadata]) => ({
        kanji: kanjiCharacter,
        ...kanjiMetadata,
        associatedVocab: vocabularyList.filter(vocabEntry =>
            vocabEntry.writtenForm.includes(kanjiCharacter)
        )
    }))
}
