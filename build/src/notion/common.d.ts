import type { RichText } from './blocks';
/**
 * The limits that the Notion API uses for property values.
 * @see https://developers.notion.com/reference/request-limits#limits-for-property-values
 */
export declare const LIMITS: {
    PAYLOAD_BLOCKS: number;
    RICH_TEXT_ARRAYS: number;
    RICH_TEXT: {
        TEXT_CONTENT: number;
        LINK_URL: number;
        EQUATION_EXPRESSION: number;
    };
};
export interface RichTextOptions {
    annotations?: {
        bold?: boolean;
        italic?: boolean;
        strikethrough?: boolean;
        underline?: boolean;
        code?: boolean;
        color?: string;
    };
    url?: string;
}
export declare function richText(content: string, options?: RichTextOptions): RichText;
