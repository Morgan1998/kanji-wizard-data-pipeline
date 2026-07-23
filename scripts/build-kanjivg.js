import { XMLParser } from "fast-xml-parser";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { existsSync } from "node:fs";

const RAW_SVG_DIR = "data/raw/kanjivg"; 
const OUTPUT_FILE = "data/raw/kanjivg-master.json";

const ALWAYS_ARRAY_TAGS = new Set(["g", "path", "text"]);

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    
    isArray: (name, jpath, isLeafNode, isAttribute) => {
        return ALWAYS_ARRAY_TAGS.has(name);
    }
});

// Helper to process files in controlled batches
async function processInBatches(files, batchSize = 500) {
    const results = {};
    
    for (let i = 0; i < files.length; i += batchSize) {
        const chunk = files.slice(i, i + batchSize);
        
        // Process this entire batch in parallel
        const batchResults = await Promise.all(chunk.map(async (file) => {
            const filePath = join(RAW_SVG_DIR, file);
            const xmlData = await readFile(filePath, 'utf-8');
            const parsed = parser.parse(xmlData);
            
            const key = basename(file, '.svg');
            return { key, data: parsed.svg };
        }));

        // Merge batch results into master object
        for (const item of batchResults) {
            results[item.key] = item.data;
        }
    }
    
    return results;
}

/**
 * Recursively cleans up XML attributes we do not need for rendering or logic.
 * Safely handles both array and single-object variants.
 */
function cleanNode(node) {
    if (!node || typeof node !== "object") return;

    // 1. Redundant attributes we can safely strip from any group or path
    delete node.xmlns;
    delete node["xmlns:kvg"];
    delete node.width;
    delete node.height;
    delete node.viewBox;
    delete node.style; // We style with CSS, so we can drop the inline style strings

    // 2. Recursively clean nested groups ('g')
    if (node.g) {
        const groups = Array.isArray(node.g) ? node.g : [node.g];
        groups.forEach(cleanNode);
    }

    // 3. Recursively clean nested paths ('path')
    if (node.path) {
        const paths = Array.isArray(node.path) ? node.path : [node.path];
        paths.forEach(cleanNode);
    }
}

async function buildKanjiVG() {
    console.log("🚀 Starting Optimized KanjiVG build process...");
    const startTime = Date.now();

    try {
        const allFiles = await readdir(RAW_SVG_DIR);
        const svgFiles = allFiles.filter(file => extname(file).toLowerCase() === '.svg');
        
        // 1. Process all files in blazingly fast parallel batches
        const masterData = await processInBatches(svgFiles, 500);

        // 2. Clean attributes from every compiled Kanji to save megabytes of space
        Object.values(masterData).forEach(cleanNode);

        await mkdir('data/raw', { recursive: true });
        
        // 3. Minify the JSON output (no spaces/newlines) for optimal load times in Anki
        await writeFile(OUTPUT_FILE, JSON.stringify(masterData));
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✨ Successfully parsed and optimized ${svgFiles.length} kanji in ${duration}s`);
        
    } catch (error) {
        console.error("❌ Error building KanjiVG JSON:", error);
    }
}

buildKanjiVG();