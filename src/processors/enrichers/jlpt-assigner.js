// src/processors/enrichers/jlpt-assigner.js
import fs from 'fs';
import { join } from 'path';

const ROOT_DIR = '../../../';

export function assignJlptLevel(vocabularyList) {
  const rawMapping = JSON.parse(
    fs.readFileSync(join(ROOT_DIR, 'data/raw/JLPT_vocab_ALL.json'), 'utf-8')
  );
  
  const jlptMap = new Map(Object.entries(rawMapping));

  return vocabularyList.map(entry => {

    const level = jlptMap.get(entry.writtenForm) || null;
    
    return {
      ...entry,
      jlptLevel: level
    };
  });
}