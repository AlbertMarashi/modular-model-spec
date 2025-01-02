<script
    lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Edit from "svelte-material-icons/Pencil.svelte"

const {
    onedit,
}: {
    onedit: () => void
} = $props()
</script>
<branch-controls>
    <edit-area>
        <button
            onclick={onedit}>
            <Icon
                icon={Edit} />
        </button>
    </edit-area>
</branch-controls>
<style>


button {
    padding: 10px;
    font-size: 24px;
    cursor: pointer;
    border-radius: 50px;
    --size: 22px;
    --opacity: 0.5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:hover {
        --opacity: 1;
        background: rgba(var(--foreground-rgb), 0.1);
    }
}

branch-controls {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: -16px;
}

</style>    