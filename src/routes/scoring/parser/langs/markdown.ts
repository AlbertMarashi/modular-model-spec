import { languages } from "../languages"
import { Interceptor, type Parser } from "../parsers"
import { TokenFlag } from "../types"
import { expect_text, peek_text } from "../utils"

// We define a helper class to manage state and buffering
class MarkdownState {
    flags: TokenFlag = TokenFlag.none
}

export function parse_markdown(parser: Parser) {
    while (parser.peek_i(0) !== null) {
        const state = new MarkdownState()
        parse_line(parser, state)
    }
}


// parse any consecutive newlines into a single token
function parse_newlines(parser: Parser) {
    let found = false
    while (parser.peek_i(0) === "\n") {
        parser.next()
        found = true
    }
    if (found) parser.complete("markdown")
}

// Parse a single line of markdown
function parse_line(parser: Parser, state: MarkdownState) {
    parse_newlines(parser)

    const ch = parser.peek_i(0)

    if (ch === null) return

    switch (ch) {
        case "#": return parse_heading(parser, state)
        case "`": return parse_code_fence(parser, state, true)
        case "-": return parse_list_item(parser, state)
    }

    // Not a heading line, parse inline content directly
    parse_inline_content(parser, state)
    parser.complete("markdown", state.flags)
}


function parse_heading(parser: Parser, state: MarkdownState) {
    state.flags |= TokenFlag.heading

    let count = 0
    while (parser.peek_i(0) === "#") {
        parser.next()
        count++
    }
    // note invalid markdown heading
    if (count > 6) parser.error("markdown", "markdown heading with more than 6 levels", TokenFlag.heading)

    // space must separate the heading
    const space = parser.next()
    if (space !== " ") parser.error("markdown", "expected space after heading", TokenFlag.heading)

    parser.complete("markdown", state.flags)

    parse_inline_content(parser, state)
}

// Inline content: handles emphasis, links, code, etc.
function parse_inline_content(parser: Parser, state: MarkdownState) {
    while (parser.peek_i(0) !== null) {
        const ch = parser.peek_i(0)
        if (ch === null || ch === "\n") return parser.complete("markdown", state.flags)

        // check for inline formatting
        switch (ch) {
            case "`": parse_code_fence(parser, state); break
            case "*": parse_asterisk(parser, state); break
            default: {
                // just text
                parser.next()
                continue
            }
        }
    }
}


/**

 */
function parse_asterisk(parser: Parser, state: MarkdownState) {
    const double = parser.peek_i(1) === "*"
    const triple = parser.peek_i(2) === "*"

    const in_bold = state.flags & TokenFlag.bold
    const in_italic = state.flags & TokenFlag.italic


    if (triple && in_bold && in_italic) {
        parser.next() // 1st (bold)
        parser.next() // 2nd (bold)
        parser.next() // 3rd (italic)
        parser.complete("markdown", state.flags)
        state.flags &= ~(TokenFlag.bold | TokenFlag.italic)
        return
    }

    if (double && in_bold) {
        parser.next() // 1st (bold)
        parser.next() // 2nd (bold)
        parser.complete("markdown", state.flags)
        state.flags &= ~(TokenFlag.bold)
        return
    }

    if (in_italic) {
        parser.next() // 1st (italic)
        parser.complete("markdown", state.flags)
        state.flags &= ~(TokenFlag.italic)
        return
    }

    // else we're starting a new formatting context
    // complete the previous data...
    parser.complete("markdown", state.flags)
    if (triple) state.flags |= TokenFlag.bold | TokenFlag.italic
    else if (double) state.flags |= TokenFlag.bold
    else state.flags |= TokenFlag.italic

    parser.next()
    if (double) parser.next()
    if (triple) parser.next()
}


/**
 * Need to parse:
 * ```json
 * {
 *    "key": "value"
 * }
 * ```
 * 
 * ```
 * no format code block
 * ```
 * 
 * ````
 * ```
 * nested codeblock
 * ```
 * ````
 * 
 * `inline code`
 * `` `escaped inline code` `` 
 * ``` ``at increasing depths `` ```
 * ```` ```like this ``` ````
 */
function parse_code_fence(parser: Parser, state: MarkdownState, from_newline: boolean = false) {
    // complete anything that came prior
    parser.complete("markdown", state.flags)

    // count number of opening backticks
    let count = 0
    while (parser.peek_i(0) === "`") {
        parser.next()
        count++
    }

    const closing = "`".repeat(count)
    state.flags |= TokenFlag.code

    let consumed = ""

    while (true) {
        const ch = parser.peek_i(0)

        if (ch === null) return parser.error("markdown", "unterminated block")

        consumed += ch

        switch (ch) {
            // We will never run into this first, so it's safe to assume that
            // we are possibly starting the end of the code fence
            case "`": {

                if (!expect_text(parser, closing)) {
                    // it's an escaped backtick, so continue
                    parser.next()
                    continue
                };

                // we've found the closing backticks
                // parser.next() // consume the backtick
                parser.complete("markdown", state.flags)

                state.flags &= ~TokenFlag.code

                return
            }
            case "\n": {
                if (count < 3 || !from_newline) {
                    parser.error("markdown", "unterminated inline code fence", state.flags)
                    state.flags = TokenFlag.none
                    parser.next() // consume the whitespace
                    return parser.complete("markdown")
                }


                return parse_sublanguage(parser, consumed.trim(), "\n" + closing)
            }
            default: {
                parser.next()
                continue
            }
        }
    }
}

function parse_sublanguage(parser: Parser, format: string, closing: string) {
    // this is a fenced codeblock, so we gotta check for
    // the sub language, and parse it, and consume the whitespace
    parser.next()
    parser.complete("markdown", TokenFlag.code)

    const parse_fn = languages[format] || languages["markdown"]
    const interceptor = new Interceptor(parser, p => peek_text(p, closing))
    parse_fn(interceptor)

    expect_text(parser, closing)
    parser.complete("markdown", TokenFlag.code)
}

function parse_list_item(parser: Parser, state: MarkdownState) {
    parser.complete("markdown", state.flags)

    expect_text(parser, "-")

    state.flags |= TokenFlag.list
    parser.next()

    parser.complete("markdown", state.flags)

    state.flags &= ~TokenFlag.list

    parse_inline_content(parser, state)
}

function is_digit(ch: string): boolean {
    return ch >= "0" && ch <= "9"
}
