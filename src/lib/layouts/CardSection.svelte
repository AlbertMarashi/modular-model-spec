<script lang="ts">

export let gap: string | undefined = undefined
export let padding: string | undefined = undefined
</script>
<card-section
    style:gap
    style:padding>
    <slot/>
</card-section>

<style>
card-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    &:last-child {
        border-bottom: none;
    }
}
</style>