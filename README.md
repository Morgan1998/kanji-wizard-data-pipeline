## Sources & Credits

### 🗃️ Data Sources & Provenance (データソースと帰属)

This project strictly adheres to the open-source licenses of the following foundational datasets. Data processing pipelines trace back to their primary upstream creators:

#### 1. JLPT Kanji Dataset
* **Direct Source:** [Renairisu/jlpt_kanji_json_msgpack](https://github.com/Renairisu/jlpt_kanji_json_msgpack) (Kanji lists organized by JLPT level)
* **Upstream Creator:** [kanjiapi.dev](https://kanjiapi.dev) (Primary Kanji API data source)
* **License/Terms:** Explicit compliance with the downstream transformation repository's data structure.

#### 2. Japanese-English Dictionary Dataset (JMdict)
* **Direct Source:** [scriptin/jmdict-simplified (Release 3.6.2+)](https://github.com/scriptin/jmdict-simplified/releases)
* **Upstream Creator:** [EDRDG / Jim Breen](http://www.edrdg.org/) (Electronic Dictionary Research and Development Group)
* **License:** Distributed under the [EDRDG Licence Statement](http://edrdg.org) (Creative Commons Attribution-ShareAlike 3.0 Unported).

#### 3. JLPT Vocabulary Dataset
* **Direct Source:** [Bluskyo/JLPT_Vocabulary](https://github.com/Bluskyo/JLPT_Vocabulary/releases) (Structured JSON/CSV word lists with JLPT classification)
* **Upstream Creator:** Jonathan Waller via [Tanos JLPT Word Lists](https://tanos.co.uk)
* **License:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org)

#### 4. Vocabulary Frequency Dataset **For Anki Deck Generation**
* **Data Source:** [JPDB.io](https://jpdb.io) (Original corpus/frequency data)
* **Format & Infrastructure:** Maintained by [MarvNC](https://github.com/MarvNC/yomitan-dictionaries) via the Yomitan Dictionaries ecosystem.
* **Direct Repository:** [Kuuuube / yomitan-dictionaries](https://github.com/Kuuuube/yomitan-dictionaries) (Mirror/Collection)
* **License/Usage:** Data derived from JPDB.io. This project utilizes the dataset for personal educational and portfolio purposes. Please note that this data is subject to the terms of the original platform and is intended for non-commercial use.
