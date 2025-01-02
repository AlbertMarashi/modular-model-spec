export type Token = {
    lang: string
    start: number
    len: number
    flags: TokenFlag
    // text: string | null // null is unexpected EOF
    // marks: TokenMark[]
    error?: string
}

export enum TokenFlag {
    none = 0,

    // Thread marks
    special = 1 << 1, // eg, <|role|>, <|content|> etc.

    // Formatting marks
    bold = 1 << 2, // **bold** text
    italic = 1 << 3, // *italic* text
    heading = 1 << 4, // #, ##, ### for headings
    code = 1 << 5, // Inline `code` or ```code block```
    link = 1 << 6, // Hyperlink, e.g., [link](url)
    list = 1 << 7, // List items, e.g., - or 1.
    quote = 1 << 8, // Blockquote, e.g., > quote



    // Code marks
    punctuation = 1 << 9, // various punctuations and symbols
    tag = 1 << 10, // HTML tags, e.g. `div` in </div>

    keyword = 1 << 13, // Keywords, e.g., if, def, function
    ident = 1 << 14, // Identifier, e.g., variable names
    function = 1 << 15, // Function names
    string = 1 << 16, // String literals
    number = 1 << 17, // Number literals
    boolean = 1 << 18, // Boolean values, e.g., true, false
    null = 1 << 19, // Null values, e.g., null, None
    type = 1 << 20, // Type annotations, e.g., int, string
    property = 1 << 21, // Object properties
    comment = 1 << 22, // Comments in code
    regexp = 1 << 23, // Regular expressions
    bracket = 1 << 24, // Brackets, e.g., {}, [], ()
}

export const TokenKeys = Object.keys(TokenFlag) as (keyof typeof TokenFlag)[]

export abstract class Iter<T> {
    abstract peek_i(n: number): T | null
    abstract next(): T | null
}

export class StringIter extends Iter<string> {
    constructor(protected source: Iter<string>) { super() }

    peek_i(n: number): string | null {
        return this.source.peek_i(n)
    }

    next(): string | null {
        return this.source.next()
    }

    peek_text(str: string): boolean {
        for (let i = 0; i < str.length; i++) {
            if (this.peek_i(i) !== str[i]) return false
        }
        return true
    }

    expect_text(str: string): string | null {
        for (let i = 0; i < str.length; i++) {
            if (this.source.peek_i(i) !== str[i]) return null
        }
        this.consume_until(str)
        return str
    }

    consume_until(str: string) {
        const text = ""

        return text
    }
}

