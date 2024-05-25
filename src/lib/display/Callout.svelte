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
    height: 100%;
    width: 100%;
    padding: 16px;
    border-radius: 6px;
    border-left: 6px solid rgba(var(--color-rgb), 1);
    background: color-mix(in srgb, rgba(var(--color-rgb), 1) 10%, var(--background));
    color: color-mix(in srgb, rgba(var(--color-rgb), 1) 90%, var(--foreground));
    & .content {
        padding: 3px 0;
    }

}

.callout.note {
    --color-rgb: var(--blue-rgb);
}

.callout.error {
    --color-rgb: var(--red-rgb);
}

.callout.warning {
    --color-rgb: var(--orange-rgb);
}

.callout.success {
    --color-rgb: var(--green-rgb);
}
</style>