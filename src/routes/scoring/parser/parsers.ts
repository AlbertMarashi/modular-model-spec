import type { Iter} from "./types"
import { TokenFlag, type Token } from "./types"

export abstract class Parser implements Iter<string> {
    constructor() { }

    abstract peek_i(n: number): string | null
    abstract next(): string | null

    abstract complete(lang: string, flags?: TokenFlag): true
    abstract error(lang: string, error: string, flags?: TokenFlag): null

    optional(): OptionalConsumer {
        return new OptionalConsumer(this)
    }
}


export class SourceParser extends Parser {
    tokens: Token[] = []
    private start = 0
    private consumed = 0

    constructor(private source: string) {
        super()
    }

    peek_i(n: number): string | null {
        return this.source[this.start + this.consumed + n] || null
    }

    next(): string | null {
        const c = this.peek_i(0)
        if (c === null) return null
        this.consumed += 1
        return c
    }


    complete(lang: string, flags: TokenFlag = TokenFlag.none): true {
        this.tokens.push({
            lang,
            flags,
            start: this.start,
            len: this.consumed,
        })
        this.start += this.consumed
        this.consumed = 0
        return true
    }

    error(lang: string, error: string, flags: TokenFlag = TokenFlag.none): null {
        this.tokens.push({
            lang,
            error,
            flags,
            start: this.start,
            len: this.consumed,
        })
        this.start += this.consumed
        this.consumed = 0
        return null
    }
}


export class Interceptor extends Parser {
    constructor(protected source: Parser, protected predicate: (source: Parser) => boolean) {
        super()
    }

    peek_i(n: number): string | null {
        const optional = new OptionalConsumer(this.source)

        for (let i = 0; i < n; i++) {
            optional.next()
        }

        if (this.predicate(optional)) return null

        return this.source.peek_i(n)
    }

    next(): string | null {
        if (!this.peek_i(0)) return null
        return this.source.next()
    }

    complete(lang: string, flags: TokenFlag = TokenFlag.none): true {
        return this.source.complete(lang, flags)
    }

    error(lang: string, error: string, flags: TokenFlag = TokenFlag.none): null {
        return this.source.error(lang, error, flags)
    }
}


export class OptionalConsumer extends Parser {
    private consumed = 0
    private start = 0
    private tokens: Token[] = []

    constructor(private parser: Parser) { super() }

    peek_i(n: number): string | null {
        const value = this.parser.peek_i(n + this.start + this.consumed)
        if (value === null) return null
        return value
    }

    next(): string | null {
        const c = this.peek_i(0)
        if (c === null) return null
        this.consumed += 1
        return c
    }

    consume(): void {
        if (this.consumed !== 0) throw new Error("Unconsumed token in buffer")

        for (let i = 0; i < this.tokens.length; i++) {
            const tok = this.tokens[i]
            if (!tok.len) break

            // consume the chars from the parent
            for (let j = 0; j < tok.len; j++) {
                this.parser.next()
            }

            // complete the token
            if (tok.error) this.parser.error(tok.lang, tok.error, tok.flags)
            else this.parser.complete(tok.lang, tok.flags)
        }
        this.start = 0
        this.consumed = 0
        this.tokens = []
    }

    complete(lang: string, flags: TokenFlag = TokenFlag.none): true {
        this.tokens.push({ lang, flags, start: this.start, len: this.consumed })
        this.start += this.consumed
        this.consumed = 0
        return true
    }

    error(lang: string, error: string, flags: TokenFlag = TokenFlag.none): null {
        this.tokens.push({ lang, flags, start: this.start, len: this.consumed, error })
        this.start += this.consumed
        this.consumed = 0
        return null
    }
}
