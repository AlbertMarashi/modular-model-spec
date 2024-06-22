<script lang="ts">
import Button from "$lib/controls/Button.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import AccountPlus from "svelte-material-icons/AccountPlus.svelte"
import { page } from "$app/stores"
import Callout from "$lib/display/Callout.svelte"
import Heading from "$lib/display/Heading.svelte"
</script>
<div class="vertical">
    <Callout type="error">
        <Heading level={3}>{ $page.url.searchParams.get("error") ?? "An error occurred" }</Heading>
        <p>{ $page.url.searchParams.get("message") ?? "An error occurred" }</p>
    </Callout>
</div>
<div class="vertical">
    <Button
        expand={true}
        href="/create"
        label="Create Account"
        right_icon={AccountPlus}
        type="tonal"/>
    <Button
        expand={true}
        href="/login"
        label="Login"
        right_icon={ExitToApp}
        type="tonal"/>
</div>

<style>

.vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    justify-content: center;
    width: 100%;
    padding: 32px;
    max-width: 500px;
}

</style>