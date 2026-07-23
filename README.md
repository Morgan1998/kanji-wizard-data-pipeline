# Kanji Wizard ETL Pipeline 

A Node.js data pipeline that extracts, transforms, and loads Japanese lexical datasets into structured outputs. 

## Why? 

The `Kanji Wizard` project needed a way to source validated, structured, and scalable kanji data to plug into its core engine. Many kanji decks on Anki 
utilize arbitrary vocabulary selection for kanji. This pipeline aims to allow the creation of high quality datasets that can instantly be plugged into
the Kanji Wizard engine for new deck creation. It will also allow for creation of unique decks that fit the interest/needs of the user. Unique deck factors include: filtering kanji sets or associated vocab by JLPT level, vocab frequency ratings relative to the applied corpus, and various combinations of JLPT level kanji sets. 

## Technical Stack and Architectural Strategies

*   **Runtime:** Node.js (Asynchronous Environment)
*   **Design Pattern:** Modular ETL to cleanly isolate each stage of the pipeline for readability, scalability, and isolated testing boundaries.
*   **Dependency Management:** Native Node.js Subpath Imports to optimize import management. 
*   **Data Structures:** JavaScript `Map` allocations to implement `O(1)` memory lookups

## Quick Start

### Prerequisites
* Node.js v18.0.0+

### Installation
```bash
npm install
```
* Core datasets will be downloaded upon running `npm install`



## 🗃️ Data Sources & Provenance (データソースと帰属)

This project strictly adheres to the open-source licenses of the following foundational datasets. Data processing pipelines trace back to their primary upstream creators:

#### 1. Japanese-English Dictionary Dataset (JMdict)
* **Direct Source:** [scriptin/jmdict-simplified (Release 3.6.2+)](https://github.com/scriptin/jmdict-simplified/releases)
* **Upstream Creator:** [EDRDG / Jim Breen](http://www.edrdg.org/) (Electronic Dictionary Research and Development Group)
* **License:** Distributed under the [EDRDG Licence Statement](http://edrdg.org) (Creative Commons Attribution-ShareAlike 3.0 Unported).

#### 2. JLPT Vocabulary Dataset
* **Direct Source:** [Bluskyo/JLPT_Vocabulary](https://github.com/Bluskyo/JLPT_Vocabulary/releases) (Structured JSON/CSV word lists with JLPT classification)
* **Upstream Creator:** Jonathan Waller via [Tanos JLPT Word Lists](https://tanos.co.uk)
* **License:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org)

#### 3. Vocabulary Frequency Dataset **For Anki Deck Generation**
* **Data Source:** [JPDB.io](https://jpdb.io) (Original corpus/frequency data)
* **Format & Infrastructure:** Maintained by [MarvNC](https://github.com/MarvNC/yomitan-dictionaries) via the Yomitan Dictionaries ecosystem.
* **Direct Repository:** [Kuuuube / yomitan-dictionaries](https://github.com/Kuuuube/yomitan-dictionaries) (Mirror/Collection)
* **License/Usage:** Data derived from JPDB.io. This project utilizes the dataset for personal educational and portfolio purposes. Please note that this data is subject to the terms of the original platform and is intended for non-commercial use.

#### 4. Main Kanji Dataset
* **Data Source:** [davidluzgouveia/kanji-data](https://github.com/davidluzgouveia/kanji-data) (Master kanji dataset with over 13,000 kanji, including core data for each kanji entry)
* **Upstream Creator:** [EDRDG / Jim Breen](https://www.edrdg.org/) (Electronic Dictionary Research and Development Group)
* **License:** Distributed under the [EDRDG Licence Statement](http://edrdg.org) (Creative Commons Attribution-ShareAlike 3.0 Unported).

#### 5. JLPT Kanji Dataset
* **Direct Source:** [Renairisu/jlpt_kanji_json_msgpack](https://github.com/Renairisu/jlpt_kanji_json_msgpack) (Kanji lists organized by JLPT level)
* **Upstream Creator:** [kanjiapi.dev](https://kanjiapi.dev) (Primary Kanji API data source)
* **License/Terms:** Explicit compliance with the downstream transformation repository's data structure.




## 🗺️ Project Roadmap

### Phase 1: Setup Core architecture
- [x] **Implement a simple ETL file structure:** Use ETL (Extract, Transform, Load) to organize the core modules of the project.
- [x] **Utilize Subpath Imports :** Switch from barrel imports to subpath imports to eliminate risk of circular dependency and only execute the exact modules needed for a given operation. 
- [x] **Refactor to use promise-based APIs :** Make use of promise-based APIs to enforce non-blocking asynchronous execution. 

### Phase 2: Testing
- [x] **Implement testing:** Write clean unit tests for each module.

### Phase 3: Interface
- [x] **Command Line Interface (CLI):** Implement the `Commander` package to allow passing in of process arguments for dynamic dataset creation. 

### Phase 4: Core Performance Optimization
- [x] **In-Memory Kanji Hashing:** Implement a JavaScript `Map` structure to achieve `O(1)` instant lookups for Kanji metadata, preventing nested loop slowdowns.
- [] **Peer review:** Have engineer peers review the pipeline to point out any potential optimizations. 

### Phase 5: Use with the Kanji Wizard project
- [] **Use it!** Successfully launch a Kanji Wizard deck by using a dataset sourced from this pipeline.