import { Iter, type Token } from "../types";


export class NestedParser extends Iter<string> {
    constructor(private source: Iter<string>, private tokens: Token[]) { super() }

    peek_i(n: number): string | null {
        throw new Error("Method not implemented.")
    }

    next(): string | null {
        throw new Error("Method not implemented.")
    }
}
