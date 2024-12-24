<script
    lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Edit from "svelte-material-icons/Pencil.svelte"

</script>
<branch-controls>
    <edit-area>
        <icon-button>
            <Icon
                icon={Edit} />
        </icon-button>
    </edit-area>
</branch-controls>
<style>


icon-button {
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