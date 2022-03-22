"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRichText = exports.parseBlocks = void 0;
const notion = __importStar(require("../notion"));
const url_1 = require("url");
const notion_1 = require("../notion");
function ensureLength(text, copy) {
    const chunks = text.match(/[^]{1,2000}/g) || [];
    return chunks.flatMap((item) => notion.richText(item, copy));
}
function parseInline(element, options) {
    var _a;
    const copy = {
        annotations: {
            ...((_a = options === null || options === void 0 ? void 0 : options.annotations) !== null && _a !== void 0 ? _a : {}),
        },
        url: options === null || options === void 0 ? void 0 : options.url,
    };
    switch (element.type) {
        case 'text':
            return ensureLength(element.value, copy);
        case 'delete':
            copy.annotations.strikethrough = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'emphasis':
            copy.annotations.italic = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'strong':
            copy.annotations.bold = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'link':
            copy.url = element.url;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'inlineCode':
            copy.annotations.code = true;
            return [notion.richText(element.value, copy)];
        default:
            return [];
    }
}
function parseParagraph(element) {
    // If a paragraph containts an image element as its first element
    // Lets assume it is an image, and parse it as only that (discard remaining content)
    const isImage = element.children[0].type === 'image';
    if (isImage) {
        const image = element.children[0];
        try {
            new url_1.URL(image.url);
            return notion.image(image.url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            console.log(`${error.input} is not a valid url, I will process this as text for you to fix later`);
        }
    }
    // Paragraphs can also be legacy 'TOC' from some markdown
    const mightBeToc = element.children.length > 2 &&
        element.children[0].type === 'text' &&
        element.children[0].value === '[[' &&
        element.children[1].type === 'emphasis';
    if (mightBeToc) {
        const emphasisItem = element.children[1];
        const emphasisTextItem = emphasisItem.children[0];
        if (emphasisTextItem.value === 'TOC') {
            return notion.table_of_contents();
        }
    }
    const text = element.children.flatMap(child => parseInline(child));
    return notion.paragraph(text);
}
function parseBlockquote(element) {
    // Quotes can only contain RichText[], but come through as Block[]
    // This code collects and flattens the common ones
    const blocks = element.children.flatMap(child => parseNode(child));
    const paragraphs = blocks.flatMap(child => child);
    const richtext = paragraphs.flatMap(child => {
        if (child.paragraph) {
            return child.paragraph.rich_text;
        }
        if (child.heading_1) {
            return child.heading_1.rich_text;
        }
        if (child.heading_2) {
            return child.heading_2.rich_text;
        }
        if (child.heading_3) {
            return child.heading_3.rich_text;
        }
        return [];
    });
    return notion.blockquote(richtext);
}
function parseHeading(element) {
    const text = element.children.flatMap(child => parseInline(child));
    switch (element.depth) {
        case 1:
            return notion.headingOne(text);
        case 2:
            return notion.headingTwo(text);
        default:
            return notion.headingThree(text);
    }
}
function parseCode(element) {
    const text = ensureLength(element.value);
    return notion.code(text);
}
function parseList(element) {
    return element.children.flatMap(item => {
        const paragraph = item.children.shift();
        if (paragraph === undefined || paragraph.type !== 'paragraph') {
            return [];
        }
        const text = paragraph.children.flatMap(child => parseInline(child));
        // Now process any of the children
        const parsedChildren = item.children.flatMap(child => parseNode(child));
        if (element.start !== null && element.start !== undefined) {
            return [notion.numberedListItem(text, parsedChildren)];
        }
        else if (item.checked !== null && item.checked !== undefined) {
            return [notion.toDo(item.checked, text, parsedChildren)];
        }
        else {
            return [notion.bulletedListItem(text, parsedChildren)];
        }
    });
}
function parseTableCell(node) {
    const text = node.children.flatMap(child => parseInline(child));
    return [notion.tableCell(text)];
}
function parseTableRow(node) {
    const tableCells = node.children.flatMap(child => parseTableCell(child));
    return [notion.tableRow(tableCells)];
}
function parseTable(node) {
    const tableRows = node.children.flatMap(child => parseTableRow(child));
    return [notion.table(tableRows)];
}
function parseNode(node, unsupported = false) {
    switch (node.type) {
        case 'heading':
            return [parseHeading(node)];
        case 'paragraph':
            return [parseParagraph(node)];
        case 'code':
            return [parseCode(node)];
        case 'blockquote':
            return [parseBlockquote(node)];
        case 'list':
            return parseList(node);
        case 'table':
            if (unsupported) {
                return parseTable(node);
            }
            else {
                return [];
            }
        default:
            return [];
    }
}
function parseBlocks(root, options) {
    var _a, _b, _c, _d;
    const parsed = root.children.flatMap(item => parseNode(item, (options === null || options === void 0 ? void 0 : options.allowUnsupported) === true));
    const truncate = !!((_b = (_a = options === null || options === void 0 ? void 0 : options.notionLimits) === null || _a === void 0 ? void 0 : _a.truncate) !== null && _b !== void 0 ? _b : true), limitCallback = (_d = (_c = options === null || options === void 0 ? void 0 : options.notionLimits) === null || _c === void 0 ? void 0 : _c.onError) !== null && _d !== void 0 ? _d : (() => { });
    if (parsed.length > notion_1.LIMITS.PAYLOAD_BLOCKS)
        limitCallback(new Error(`Resulting blocks array exceeds Notion limit (${notion_1.LIMITS.PAYLOAD_BLOCKS})`));
    return truncate ? parsed.slice(0, notion_1.LIMITS.PAYLOAD_BLOCKS) : parsed;
}
exports.parseBlocks = parseBlocks;
function parseRichText(root, options) {
    var _a, _b, _c, _d;
    if (root.children[0].type !== 'paragraph') {
        throw new Error(`Unsupported markdown element: ${JSON.stringify(root)}`);
    }
    const richTexts = [];
    root.children.forEach(paragraph => {
        if (paragraph.type === 'paragraph') {
            paragraph.children.forEach(child => richTexts.push(...parseInline(child)));
        }
    });
    const truncate = !!((_b = (_a = options === null || options === void 0 ? void 0 : options.notionLimits) === null || _a === void 0 ? void 0 : _a.truncate) !== null && _b !== void 0 ? _b : true), limitCallback = (_d = (_c = options === null || options === void 0 ? void 0 : options.notionLimits) === null || _c === void 0 ? void 0 : _c.onError) !== null && _d !== void 0 ? _d : (() => { });
    if (richTexts.length > notion_1.LIMITS.RICH_TEXT_ARRAYS)
        limitCallback(new Error(`Resulting richTexts array exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT_ARRAYS})`));
    return (truncate ? richTexts.slice(0, notion_1.LIMITS.RICH_TEXT_ARRAYS) : richTexts).map(rt => {
        var _a;
        if (rt.text.content.length > notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT) {
            limitCallback(new Error(`Resulting text content exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT})`));
            if (truncate)
                rt.text.content =
                    rt.text.content.slice(0, notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT - 3) + '...';
        }
        if (((_a = rt.text.link) === null || _a === void 0 ? void 0 : _a.url) &&
            rt.text.link.url.length > notion_1.LIMITS.RICH_TEXT.LINK_URL)
            // There's no point in truncating URLs
            limitCallback(new Error(`Resulting text URL exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT.LINK_URL})`));
        // Notion equations are not supported by this library, since they don't exist in Markdown
        return rt;
    });
}
exports.parseRichText = parseRichText;
//# sourceMappingURL=internal.js.map