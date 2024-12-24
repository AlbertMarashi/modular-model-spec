
import type { Parser } from "./parsers"

export function consume_until(parser: Parser, str: string): string {
    let text = ""
    while (parser.peek_i(0) !== null) {
        if (peek_text(parser, str)) return text
        text += parser.next() || ""
    }
    return text
}

export function expect_text(parser: Parser, str: string): string | null {
    for (let i = 0; i < str.length; i++) {
        if (parser.peek_i(i) !== str[i]) return null
    }
    for (let i = 0; i < str.length; i++) {
        parser.next()
    }
    return str
}

export function peek_text(parser: Parser, str: string): boolean {
    for (let i = 0; i < str.length; i++) {
        if (parser.peek_i(i) !== str[i]) return false
    }

    return true
}


