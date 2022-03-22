import * as md from '../markdown';
import * as notion from '../notion';
/** Options common to all methods. */
export interface CommonOptions {
    /**
     * Define how to behave when an item exceeds the Notion's request limits.
     * @see https://developers.notion.com/reference/request-limits#limits-for-property-values
     */
    notionLimits?: {
        /**
         * Whether the excess items or characters should be automatically truncated where possible.
         * If set to `false`, the resulting item will not be compliant with Notion's limits.
         * Please note that text will be truncated only if the parser is not able to resolve
         * the issue in any other way.
         */
        truncate?: boolean;
        /** The callback for when an item exceeds Notion's limits. */
        onError?: (err: Error) => void;
    };
}
export interface BlocksOptions extends CommonOptions {
    /** Whether to allow unsupported object types. */
    allowUnsupported?: boolean;
}
export declare function parseBlocks(root: md.Root, options?: BlocksOptions): notion.Block[];
export declare function parseRichText(root: md.Root, options?: CommonOptions): notion.RichText[];
