"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableCell = exports.tableRow = exports.table = exports.toDo = exports.numberedListItem = exports.bulletedListItem = exports.headingThree = exports.headingTwo = exports.headingOne = exports.table_of_contents = exports.image = exports.blockquote = exports.code = exports.paragraph = void 0;
function paragraph(text) {
    return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
            rich_text: text,
        },
    };
}
exports.paragraph = paragraph;
function code(text) {
    return {
        object: 'block',
        type: 'code',
        code: {
            rich_text: text,
            language: 'javascript',
        },
    };
}
exports.code = code;
function blockquote(text) {
    return {
        object: 'block',
        type: 'quote',
        quote: {
            rich_text: text,
        },
    };
}
exports.blockquote = blockquote;
function image(url) {
    return {
        object: 'block',
        type: 'image',
        image: {
            type: 'external',
            external: {
                url: url,
            },
        },
    };
}
exports.image = image;
function table_of_contents() {
    return {
        object: 'block',
        type: 'table_of_contents',
        table_of_contents: {},
    };
}
exports.table_of_contents = table_of_contents;
function headingOne(text) {
    return {
        object: 'block',
        type: 'heading_1',
        heading_1: {
            rich_text: text,
        },
    };
}
exports.headingOne = headingOne;
function headingTwo(text) {
    return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
            rich_text: text,
        },
    };
}
exports.headingTwo = headingTwo;
function headingThree(text) {
    return {
        object: 'block',
        type: 'heading_3',
        heading_3: {
            rich_text: text,
        },
    };
}
exports.headingThree = headingThree;
function bulletedListItem(text, children = []) {
    return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
            rich_text: text,
            children: children.length ? children : undefined,
        },
    };
}
exports.bulletedListItem = bulletedListItem;
function numberedListItem(text, children = []) {
    return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
            rich_text: text,
            children: children.length ? children : undefined,
        },
    };
}
exports.numberedListItem = numberedListItem;
function toDo(checked, text, children = []) {
    return {
        object: 'block',
        type: 'to_do',
        to_do: {
            rich_text: text,
            checked: checked,
            children: children.length ? children : undefined,
        },
    };
}
exports.toDo = toDo;
function table(children = []) {
    return {
        object: 'unsupported',
        type: 'table',
        table: {
            children: children.length ? children : undefined,
        },
    };
}
exports.table = table;
function tableRow(children = []) {
    return {
        object: 'unsupported',
        type: 'table_row',
        table_row: {
            children: children.length ? children : undefined,
        },
    };
}
exports.tableRow = tableRow;
function tableCell(children = []) {
    return {
        object: 'unsupported',
        type: 'table_cell',
        table_cell: {
            children: children.length ? children : undefined,
        },
    };
}
exports.tableCell = tableCell;
//# sourceMappingURL=blocks.js.map