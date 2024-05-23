<script lang="ts">
import "./global.css"
import "./variables.css"
import "./normalise.css"
import AlertBar from "./AlertBar.svelte"
import PageLoaderBar from "./PageLoaderBar.svelte"
</script>
<PageLoaderBar/>
<AlertBar/>
<slot />
