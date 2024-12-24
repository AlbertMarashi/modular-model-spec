import { parse_json } from "./langs/json";
import { parse_thread } from "./langs/thread";
import { parse_markdown } from "./langs/markdown";
import { SourceParser, type Parser } from "./parsers";


export const languages: Record<string, (parser: Parser) => void> = {
    "thread": parse_thread,
    "json": parse_json,
    "markdown": parse_markdown,
}

export function tokenize(source: string) {
    const parser = new SourceParser(source)
    parse_thread(parser)
    return parser.tokens
}