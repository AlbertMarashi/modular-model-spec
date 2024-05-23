<script lang="ts">
import Alert from "svelte-material-icons/Alert.svelte"
import CheckCircle from "svelte-material-icons/CheckCircle.svelte"
import CloseCircle from "svelte-material-icons/CloseCircle.svelte"
import Information from "svelte-material-icons/Information.svelte"
import Icon from "./Icon.svelte"

const icons = {
    "note": Information,
    "error": CloseCircle,
    "warning": Alert,
    "success": CheckCircle,
}

export let type: keyof typeof icons
</script>
<div class="callout {type}">
    <div class="icon">
        <Icon
            --size="20px"
            icon={icons[type]}/>
    </div>
    <div class="content">
        <slot/>
    </div>
</div>
<style>
.icon {
    padding-top: 4px;
}
.callout {
    display: flex;
    gap: 16px;
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--foreground) 10%, transparent);
    /* border: 1px solid color-mix(in srgb, var(--foreground) 10%, transparent); */
    & .content {
        padding: 3px 0;
    }
}

.callout.note {
    background: rgba(var(--blue-rgb), 0.05);
    border-color: rgba(var(--blue-rgb), 0.2);
    color: rgba(var(--blue-rgb), 0.7);
}

.callout.error {
    background: color-mix(in srgb, var(--red) 10%, transparent);
    border-color: color-mix(in srgb, var(--red) 50%, transparent);
    & .icon {
        color: var(--red);
    }
}

.callout.warning {
    background: color-mix(in srgb, var(--orange) 10%, transparent);
    border-color: color-mix(in srgb, var(--orange) 50%, transparent);
    & .icon {
        color: var(--orange);
    }
}

.callout.success {
    background: color-mix(in srgb, var(--green) 10%, transparent);
    border-color: color-mix(in srgb, var(--green) 50%, transparent);
    & .icon {
        color: var(--green);
    }
}
</style>