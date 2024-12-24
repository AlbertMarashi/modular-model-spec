<script lang="ts">
    let { branch } = $props();
</script>

<node>
    {#each branch.scores as score}
        <score style="background-color: {score.color}"></score>
    {/each}
</node>
