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
