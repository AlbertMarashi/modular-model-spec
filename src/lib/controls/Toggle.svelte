<script lang="ts">

export let value: boolean = false
</script>
<toggle-wrapper
    class:toggled={ value }
    aria-checked={value}
    role="switch"
    tabindex="0"
    on:keyup={ e => { if(e.key === "Enter") value = !value } }
    on:click={ () => value = !value }>
    <toggle/>
</toggle-wrapper>

<style>
toggle-wrapper {
    display: flex;
    width: 40px;
    height: 20px;
    background: #eee;
    border-radius: 20px;
    position: relative;
    transition: all .2s ease-in-out;
    &:focus {
        /* outline: none; */
    }
    &.toggled {
        background: var(--brand);
        & toggle {
            margin-left: auto;
            margin-right: 2px;
        }
    }
    & toggle {
        /* position: absolute; */
        margin-top: 2px;
        margin-left: 2px;
        margin-right: auto;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    }
}
</style>