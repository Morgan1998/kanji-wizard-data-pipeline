import fs from 'fs/promises';

export async function readRawFile(filepath) {
    if (!filePath) {
        throw new Error('[Extractor Error] A valid file path parameter must be specified');
    }

    try {
        const rawContent = await fs.readFile(filePath, 'utf-8');
        return rawContent;
    }   catch (error) {
        throw new Error(`[Extractor Failure] Failed to read resource at "${filePath}": ${error.message}`);
    }
}