import type { Parser } from "../parsers"
import { TokenFlag } from "../types"
import { expect_text } from "../utils"

export function parse_json(parser: Parser) {
    parse_json_value(parser)
    consume_ws(parser)
    if (parser.peek_i(0) !== null) {
        while (parser.next()) { }

        parser.error("json", "Expected EOF")
    }
}

export function parse_json_value(parser: Parser) {
    consume_ws(parser)

    const ch = parser.peek_i(0)

    switch (ch) {
        case '{': return parse_object(parser)
        case '[': return parse_array(parser)
        case '"': return parse_string(parser)
        case 't': return parse_boolean(parser, "true")
        case 'f': return parse_boolean(parser, "false")
        case 'n': return parse_null(parser)
        case null: return parser.error("json", "expected JSON value")
        default:
            if (is_number_start(ch)) return parse_number(parser)

            parser.next() // consume invalid character
            parser.error("json", "Unexpected character")

            return parse_json_value(parser) // continue attempting to parse JSON values
    }
}

function consume_ws(parser: Parser) {
    let ch = parser.peek_i(0)
    if (ch === null) return
    let consumed = false
    while (ch === " " || ch === "\n" || ch === "\t" || ch === "\r") {
        parser.next()
        ch = parser.peek_i(0)
        consumed = true
    }
    if (consumed) parser.complete("json")
}

function parse_object(parser: Parser) {
    if (!expect_text(parser, "{")) return parser.error("json", "Expected object")
    parser.complete("json", TokenFlag.punctuation)

    while (parser.peek_i(0) !== '}' && parser.peek_i(0) !== null) {
        consume_ws(parser)
        // key
        if (!parse_string(parser)) break
        consume_ws(parser)

        if (!expect_text(parser, ":")) return parser.error("json", "Expected ':'")
        parser.complete("json", TokenFlag.punctuation)

        // Parse value
        parse_json_value(parser)

        consume_ws(parser)

        const optional = parser.optional()
        const ch = optional.next()
        if (ch === ",") {
            optional.complete("json", TokenFlag.punctuation)
            consume_ws(optional)
            if (optional.peek_i(0) !== '"') {
                parser.next() // reconsume the comma
                parser.error("json", "Trailing comma", TokenFlag.punctuation)
                consume_ws(parser)
                break
            } else {
                optional.consume()
            }
        }
    }

    if (parser.next() === '}') {
        parser.complete("json", TokenFlag.punctuation)
    } else {
        parser.error("json", "Unterminated object")
    }
}

function parse_array(parser: Parser) {
    if (!expect_text(parser, "[")) return parser.error("json", "Expected array")
    parser.complete("json", TokenFlag.punctuation)

    consume_ws(parser)

    while (parser.peek_i(0) !== ']' && parser.peek_i(0) !== null) {
        parse_json_value(parser)

        consume_ws(parser)

        if (parser.peek_i(0) === ',') {
            parser.next()
            parser.complete("json", TokenFlag.punctuation)
            consume_ws(parser)
        }
    }

    if (parser.peek_i(0) === ']') {
        parser.next()
        return parser.complete("json", TokenFlag.punctuation)
    }
    return parser.error("json", "Unterminated array")
}
function parse_string(parser: Parser) {
    if (!expect_text(parser, '"')) return parser.error("json", "expected string")

    while (parser.peek_i(0) !== null) {
        if (parser.peek_i(0) === '\\') {
            parser.next() // consume backslash
            if (parser.peek_i(0) === null) break
            parser.next() // consume escaped char
        } else if (parser.peek_i(0) === '"') {
            parser.next() // consume closing quote
            return parser.complete("json", TokenFlag.string)
        } else {
            parser.next()
        }
    }

    parser.error("json", "unterminated string")
}

function is_number_start(char: string): boolean {
    return char === '-' || char === '+' || char === '.' || (char >= '0' && char <= '9')
}

function parse_number(parser: Parser) {
    let has_decimal = false

    while (parser.peek_i(0) !== null) {
        const char = parser.peek_i(0)
        if (!char) return parser.error("json", "expected number")
        if (char === '.' && !has_decimal) {
            has_decimal = true
            parser.next()
        } else if (char >= '0' && char <= '9' || char === '-' || char === '+' || char === 'e' || char === 'E') {
            parser.next()
        } else {
            break
        }
    }

    parser.complete("json", TokenFlag.number)
}

function parse_boolean(parser: Parser, boolean: "true" | "false") {
    if (!expect_text(parser, boolean)) return parser.error("json", `expected '${boolean}'`)

    parser.complete("json", TokenFlag.boolean)
}

function parse_null(parser: Parser) {
    if (!expect_text(parser, "null")) parser.error("json", "expected 'null'")

    parser.complete("json", TokenFlag.null)
}