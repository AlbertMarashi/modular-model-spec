import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import arraybuffer from "vite-plugin-arraybuffer"

export default defineConfig({
    plugins: [
        sveltekit(),
        // used for importing fonts in satori /api/og/+server.ts
        arraybuffer()
    ]
})
