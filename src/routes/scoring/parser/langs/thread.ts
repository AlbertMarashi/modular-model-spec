import { languages } from "../languages"
import { Interceptor, type Parser } from "../parsers"
import { TokenFlag } from "../types"
import { consume_until, expect_text, peek_text } from "../utils"

export function parse_thread(parser: Parser) {
    while (parser.peek_i(0) !== null) {
        if (!parse_message(parser)) {
            if (!consume_until(parser, "<|")) continue
            parser.error("unknown", "Expected a message")
        }
    }
}

function parse_message(parser: Parser) {
    if (!consume_special_name(parser, "role")) return null

    const role = consume_until(parser, "<|")

    if (!["user", "model", "developer", "platform", "context"].includes(role)) {
        return parser.error("thread", "Expected message role: user, model, developer, platform, context")
    }

    parser.complete("thread") // consume role name

    let format: null | string = "nested"

    if (role === "model") {
        if (!consume_special_name(parser, "format")) return null
        format = consume_until(parser, "<|")
        if (format === null) return null
        parser.complete("thread")
    }

    if (!consume_special_name(parser, "content")) return null

    const parse_fn = languages[format] || languages["markdown"]
    const interceptor = new Interceptor(parser, p => peek_text(p, "<|"))

    parse_fn(interceptor)

    if (!consume_special_name(parser, "end_message")) return null

    if (role === "model") {
        if (!peek_text(parser, "<|end_turn|>")) return true
        if (!consume_special_name(parser, "end_turn")) return null
    }


    return true
}


function consume_special_name(parser: Parser, name: string): string | null {
    const optional = parser.optional()
    const parsed_name = consume_special_token(optional)
    if (parsed_name !== name) {
        parser.error("thread", `Expected <|${name}|>`)
        if (parsed_name === "role") {
            parse_message(parser)
            return null
        }
    }
    optional.complete("thread", TokenFlag.special)
    optional.consume()
    return name
}

function consume_special_token(parser: Parser): string | null {
    if (!expect_text(parser, "<|")) return null
    const name = consume_until(parser, "|>")
    if (!name) return null
    if (!expect_text(parser, "|>")) return null

    return name
}

