<script lang="ts">
import BlocksArray from "$lib/markdown-blocks/BlocksArray.svelte"
import { generate_ast } from "$lib/utils/ast"

export let markdown: string = ""

$: ast = generate_ast(markdown)
</script>

<BlocksArray
    blocks={ast.children}
    give_max_width={true} />