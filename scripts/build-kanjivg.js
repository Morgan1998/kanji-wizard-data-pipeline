import { XMLParser } from "fast-xml-parser";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { existsSync } from "node:fs";

const RAW_SVG_DIR = "data/raw/kanjivg"; 
const OUTPUT_FILE = "data/raw/kanjivg-master.json";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    alwaysArray: ["g", "path", "text"], 
});

async function buildKanjiVG() {

    console.log("🚀 Starting KanjiVG build process...");

    try {
        const allFiles = await readdir(RAW_SVG_DIR);
        const svgFiles = allFiles.filter(file => extname(file).toLowerCase() === '.svg');
        
        const masterData = {};

        for (const file of svgFiles) {
            const filePath = join(RAW_SVG_DIR, file);
            const xmlData = await readFile(filePath, 'utf-8');
            
            const parsed = parser.parse(xmlData);

            const svgContent = parsed.svg;
            
            const key = basename(file, '.svg');
            
            masterData[key] = svgContent;
        }

        await mkdir('data/raw', { recursive: true });
        
        await writeFile(OUTPUT_FILE, JSON.stringify(masterData, null, 2));
        console.log(`✨ Successfully parsed ${svgFiles.length} kanji into ${OUTPUT_FILE}`);
        
    } catch (error) {
        console.error("❌ Error building KanjiVG JSON:", error);
    }
}

buildKanjiVG();