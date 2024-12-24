<script lang="ts">
    import Icon from "$lib/display/Icon.svelte";
    import Label from "$lib/display/Label.svelte";
    import UnfoldMoreHorizontal from "svelte-material-icons/UnfoldMoreHorizontal.svelte";

    let {
        value = $bindable(""),
        options = [],
        label,
    }: {
        value: string | null;
        options: Array<{ value: string | null; label: string }>;
        label: string;
    } = $props();

    let open = $state(false);

    function selectOption(v: string | null) {
        value = v;
        open = false;
    }
</script>

<select-container>
    <wrapper>
        <Label text={label} />
        <button
            onclick={() => (open = !open)}
            class:open
            aria-haspopup="listbox"
            aria-expanded={open}
        >
            <span>
                {options.find((o) => o.value === value)?.label ??
                    "Select Model"}
            </span>
            <Icon icon={UnfoldMoreHorizontal} --size="18px" />
        </button>
    </wrapper>

    {#if open}
        <options-list role="listbox">
            {#each options as option, i}
                <option-item
                    onclick={() => selectOption(option.value)}
                    class:selected={value === option.value}
                    role="option"
                    onkeydown={(e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                            selectOption(option.value);
                        }
                    }}
                    data-value={option.value}
                    tabindex="0"
                    aria-selected={value === option.value}
                >
                    {option.label}
                </option-item>
            {/each}
        </options-list>
    {/if}
</select-container>

<style>
    select-container {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    wrapper {
        display: flex;
        gap: 6px;
        align-items: center;
        font-size: 14px;
        justify-content: space-between;
    }

    button {
        --color: rgba(var(--foreground-rgb), 0.5);
        font-weight: 500;
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(var(--foreground-rgb), 0.8);
        cursor: pointer;
        transition: all 0.2s;

        &:hover,
        &.open {
            color: rgba(var(--foreground-rgb), 1);
            background: rgba(var(--foreground-rgb), 0.1);
        }
    }

    options-list {
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 100%;
        left: 0;
        right: 0;
        padding: 4px;
        background: color-mix(
            in srgb,
            var(--background),
            var(--foreground) 10%
        );
        border: 1px solid rgba(var(--foreground-rgb), 0.1);
        border-radius: 8px;
        overflow: hidden;
        z-index: 10;
    }

    option-item {
        padding: 10px 12px;
        border-radius: 4px;
        cursor: pointer;
        outline: none;

        &:hover {
            background: rgba(var(--foreground-rgb), 0.05);
        }

        &.selected {
            background: rgba(var(--background-rgb), 1);
        }

        &:focus {
            background: rgba(var(--background-rgb), 0.5);
        }
    }
</style>
