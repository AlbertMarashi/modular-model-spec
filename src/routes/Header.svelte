<script>
import { page } from "$app/stores"
import AccountPopout from "$lib/auth/AccountPopout.svelte"
import Toggle from "$lib/controls/Toggle.svelte"
import Chip from "$lib/controls/Chip.svelte"
import Logo from "$lib/display/Logo.svelte"
import { signIn } from "@auth/sveltekit/client"

let account_popout_opened = false
export let dark_mode = true
export async function login() {
    await signIn("github", {
        callbackUrl: "/",
    })
}

</script>
<AccountPopout bind:opened={ account_popout_opened }/>
<header>
    <inner>
        <a
            class="logo-area"
            href="/">
            <Logo size={32}/>
            <strong>Modular Model</strong> Spec
        </a>

        <right>
            <strong>Dark Mode</strong>
            <Toggle bind:value={ dark_mode }/>
            {#if !$page.data.session}
                <Chip
                    label="Login"
                    on:click={ login }/>
            {:else}
                <Chip
                    label={$page.data.session.user.name ?? "Unknown"}
                    on:click={ () => account_popout_opened = true }/>
            {/if}
        </right>
    </inner>
</header>
<style>
header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
    min-height: 60px;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
}

inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 0 16px;
    justify-content: space-between;
}

right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.logo-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1.5rem;
    font-weight: 200;
    color: rgba(var(--foreground-rgb), 0.3);
    & strong {
        font-weight: 600;
        color: rgba(var(--foreground-rgb), 0.9);
    }
}
</style>