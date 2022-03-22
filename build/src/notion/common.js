"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richText = exports.LIMITS = void 0;
/**
 * The limits that the Notion API uses for property values.
 * @see https://developers.notion.com/reference/request-limits#limits-for-property-values
 */
exports.LIMITS = {
    PAYLOAD_BLOCKS: 1000,
    RICH_TEXT_ARRAYS: 100,
    RICH_TEXT: {
        TEXT_CONTENT: 2000,
        LINK_URL: 1000,
        EQUATION_EXPRESSION: 1000,
    },
};
function richText(content, options = {}) {
    var _a;
    const annotations = (_a = options.annotations) !== null && _a !== void 0 ? _a : {};
    return {
        type: 'text',
        annotations: {
            bold: false,
            strikethrough: false,
            underline: false,
            italic: false,
            code: false,
            color: 'default',
            ...annotations,
        },
        text: {
            content: content,
            link: options.url
                ? {
                    type: 'url',
                    url: options.url,
                }
                : undefined,
        },
    };
}
exports.richText = richText;
//# sourceMappingURL=common.js.map