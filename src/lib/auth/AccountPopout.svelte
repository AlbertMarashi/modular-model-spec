<script lang="ts">
import Card from "$lib/layouts/Card.svelte"
import CardSection from "$lib/layouts/CardSection.svelte"
import Account from "svelte-material-icons/Account.svelte"
import Button from "$lib/controls/Button.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Close from "svelte-material-icons/Close.svelte"
import { page } from "$app/stores"
import { goto, invalidateAll } from "$app/navigation"
import IconButton from "$lib/controls/IconButton.svelte"
import FlexBox from "$lib/layouts/FlexBox.svelte"
import Paragraph from "$lib/display/Paragraph.svelte"
import { signOut } from "@auth/sveltekit/client"
import Scrim from "$lib/display/Scrim.svelte"
import Heading from "$lib/display/Heading.svelte"
export let opened: boolean

async function logout() {
    await signOut({ callbackUrl: "/" })
    await invalidateAll()
    await goto("/")
}
</script>
{#if opened}
    <Scrim on:close={ () => opened = false }>
        <Card max_width="600px">
            <CardSection>
                <FlexBox justify="space-between">
                    <Heading
                        left_icon={Account}
                        level={2}>Account</Heading>
                    <IconButton
                        icon={Close}
                        type="transparent"
                        on:click={ () => opened = false }/>
                </FlexBox>
            </CardSection>
            <CardSection>
                <Paragraph>
                    You are logged in as
                </Paragraph>
                <!-- <str>{ $page.data.session?.user.name }</str> -->
                <div>{ $page.data.session?.user.email }</div>
            </CardSection>
            <CardSection>
                <Button
                    label="Log out"
                    left_icon={ExitToApp}
                    type="tonal"
                    on:click={ logout }/>
            </CardSection>
        </Card>
    </Scrim>
{/if}
