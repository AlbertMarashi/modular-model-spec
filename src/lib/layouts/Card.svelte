
<script lang="ts">
export let max_width: string | undefined = undefined
</script>
<div
    style:max-width={ max_width }
    class="card">
    <slot/>
</div>


<style>
.card {
    background: rgba(var(--background-rgb));
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    width: 100%;
}
</style>