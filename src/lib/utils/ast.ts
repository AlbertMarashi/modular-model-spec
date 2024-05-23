import type { Root } from "mdast"
import { directiveFromMarkdown } from "mdast-util-directive"
import { fromMarkdown } from "mdast-util-from-markdown"
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough"
import { gfmTableFromMarkdown } from "mdast-util-gfm-table"
import { directive } from "micromark-extension-directive"
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough"
import { gfmTable } from "micromark-extension-gfm-table"
import { mdxFromMarkdown } from "mdast-util-mdx"
import { mdxjs } from "micromark-extension-mdxjs"

export function generate_ast(markdown: string): Root {
    return fromMarkdown(markdown, {
        extensions: [
            gfmTable(),
            directive(),
            gfmStrikethrough(),
            mdxjs()
            // svelte(),
        ],
        mdastExtensions: [
            directiveFromMarkdown(),
            gfmTableFromMarkdown(),
            gfmStrikethroughFromMarkdown(),
            mdxFromMarkdown()
            // svelteFromMarkdown(),
        ],
    })
}

/**
 * Registry of all mdast nodes that can occur as children of {@link Root}.
 *
 * > 👉 **Note**: {@link Root} does not need to be an entire document.
 * > it can also be a fragment.
 *
 * This interface can be augmented to register custom node types:
 *
 * For a union of all {@link Root} children, see {@link RootContent}.
 */

declare module "mdast" {
    interface RootContentMap {
        // Allow using toml nodes defined by `remark-frontmatter`.
        // table: Table
    }
}

declare module "mdast-util-directive" {
    interface ContainerDirectiveData {
        directiveLabel?: string
    }
}

// function svelte(): Extension {
//     return {
//         flow: {
//             [58]: [svelteComponent],
//         }
//     }
// }

// const svelteComponent: Construct = {
//     tokenize: function tokenizeSvelteComponent(effects, ok, nok) {
//         const tail = this.events

//         const initialSize =
//             tail && tail[tail.length - 1]
//                 ? tail[tail.length - 1][1].type === "linePrefix"
//                     ? tail[tail.length - 1][2].sliceSerialize(tail[tail.length - 1], true).length
//                     : 0
//                 : 0

//         let sizeOpen = 0
//         let previous

//         return start

//         /** @type {State} */
//         function start(code: State) {
//             effects.enter("svelteComponent")

//             return
//         }
//     }
//     concrete: true,
// }

// function svelteFromMarkdown(): Extension {
//     const svelteComponent: string | null = null

//     return {
//         canContainEols: ["svelteTextElement"],
//         enter: {
//             svelteComponent: enterSvelteComponent,
//         },
//         exit: {
//             svelteComponent: exitSvelteComponent,
//         },
//     }

//     function enterSvelteComponent(token: Token) {
//         console.log(token)

//     }

//     function exitSvelteComponent(token: Token) {
//         console.log(token)
//     }
// }