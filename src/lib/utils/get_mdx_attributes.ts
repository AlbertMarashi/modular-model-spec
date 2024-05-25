import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get_block_attributes<T extends Record<string, any>>(block: MdxJsxFlowElement): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attributes: Record<string, any> = {}

    for (const attr of block.attributes) {
        if (attr.type !== "mdxJsxAttribute") continue
        if (attr.value === null || attr.value === undefined) continue
        if (typeof attr.value !== "string") {
            attributes[attr.name] = JSON.parse(attr.value.value)
        } else {
            attributes[attr.name] = attr.value
        }
    }

    return attributes as T
}