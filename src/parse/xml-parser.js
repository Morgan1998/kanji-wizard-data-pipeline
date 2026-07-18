import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true
});

export function parseXmlToObject(rawXmlString) {
    if (!rawXmlString || rawXmlString.trim() === '') {
        throw new Error('[parser Failure] Cannot process an empty or undefined XML resource string');
    }

    try {
        const parsedStructure = parser.parse(rawXmlString);
        return parsedStructure;
    } catch (error) {
        throw new Error(`[Parser Failure] Target string contains malformed XML syntax: ${error.message}`);
    }
}