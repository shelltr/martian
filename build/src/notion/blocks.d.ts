export interface Block {
    object?: string;
    type?: string;
    paragraph?: BlockText;
    heading_1?: BlockText;
    heading_2?: BlockText;
    heading_3?: BlockText;
    image?: object;
    quote?: object;
    bulleted_list_item?: object;
    numbered_list_item?: object;
}
export interface BlockText {
    rich_text: RichText[];
}
export interface RichText {
    type: string;
    annotations: object;
    text: {
        content: string;
        link?: {
            type: 'url';
            url: string;
        };
    };
}
export declare function paragraph(text: RichText[]): Block;
export declare function code(text: RichText[]): Block;
export declare function blockquote(text: RichText[]): Block;
export declare function image(url: string): Block;
export declare function table_of_contents(): Block;
export declare function headingOne(text: RichText[]): Block;
export declare function headingTwo(text: RichText[]): Block;
export declare function headingThree(text: RichText[]): Block;
export declare function bulletedListItem(text: RichText[], children?: Block[]): Block;
export declare function numberedListItem(text: RichText[], children?: Block[]): Block;
export declare function toDo(checked: boolean, text: RichText[], children?: Block[]): Block;
export declare function table(children?: Block[]): Block;
export declare function tableRow(children?: Block[]): Block;
export declare function tableCell(children?: Block[]): Block;
