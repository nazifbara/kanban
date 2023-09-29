<script lang="ts">
	import { fly } from 'svelte/transition'
	import { createPopover, melt } from '@melt-ui/svelte'

	import { Icon } from '$lib/components'

	export let targetName: string
	export let onEdit: () => void
	export let onDelete: () => void

	const {
		elements: { trigger, content },
		states: { open }
	} = createPopover({ forceVisible: true })
</script>

<button
	use:melt={$trigger}
	class="trigger"
	aria-label="Edit or delete {targetName.toLocaleLowerCase()}"
>
	<Icon name="VerticalEllipsis" />
</button>

{#if $open}
	<ul transition:fly={{ y: -30 }} use:melt={$content} class="surface-2">
		<li>
			<button on:click={onEdit}>
				Edit {targetName}
			</button>
		</li>
		<li>
			<button on:click={onDelete}>
				Delete {targetName}
			</button>
		</li>
	</ul>
{/if}

<style lang="postcss">
	.trigger {
		padding: var(--size-2);
	}

	ul {
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-2);
		padding: var(--size-3);
		width: 192px;

		& li:first-child {
			margin-block-end: var(--size-3);
		}

		& li:last-child button {
			color: var(--danger-1);
		}
	}
</style>
