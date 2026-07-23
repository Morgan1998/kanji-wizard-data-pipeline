# Switch from using the kanji_jlpt_only.json dataset as a starting point to instead just accepting a unique list of kanji

### Problem
I realized that some people might want their kanji grouped to match certain learning resources, such as WaniKani, RTK, etc. Using kanji_jlpt_only.json as a starting point restricts us to only making datasets that contain kanji in that dataset. It's miniscule compared to all the kanji in the kanji world. 

### Solution
I've created a polymorphic parser that accepts two schemas: 
1. A string of kanjis separated by a single break
2. A JSON array of objects, with the single key of each entry being 'kanji'
Now we can start off our enrichment with a personalized array of kanji entries. Any custom arrangement of kanji can be turned into a deck now as long as the schema matches one of the two schemas above.
