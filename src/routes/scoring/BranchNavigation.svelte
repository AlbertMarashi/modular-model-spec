<script
    lang="ts">
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte"
import Icon from "$lib/display/Icon.svelte"

</script>
<zero-height-wrapper>
    <branch-navigation>
        <icon-button>
            <Icon
                icon={ChevronLeft} />
        </icon-button>
        <counter>{ 1 } / { 2 }</counter>
        <icon-button>
            <Icon
                icon={ChevronRight} />
        </icon-button>
    </branch-navigation>
</zero-height-wrapper>
<style>

zero-height-wrapper {
    max-height: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

counter {
    opacity: 0.7;
    font-weight: 600;
    text-wrap: nowrap;
    font-size: 13px;
}

branch-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    text-wrap: nowrap;
    background: color-mix(in srgb, var(--background), var(--foreground) 5%);
    border-radius: 100px;
    padding: 6px;
    z-index: 2;
}

icon-button {
    padding: 8px;
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

</style>    