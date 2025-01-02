import { parse_json } from "./langs/json"
import { parse_thread } from "./langs/thread"
import { parse_markdown } from "./langs/markdown"
import { SourceParser, type Parser } from "./parsers"


export const languages: Record<string, (parser: Parser) => void> = {
    "thread": parse_thread,
    "json": parse_json,
    "markdown": parse_markdown,
}

export function tokenize(source: string, language: string = "thread") {
    const parser = new SourceParser(source)
    languages[language](parser)
    return parser.tokens
}