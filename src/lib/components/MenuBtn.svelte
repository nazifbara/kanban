<script lang="ts">
	import { fly } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'

	import { Icon, Nav, ThemeSwitcher } from '$lib/components'
	import { boards } from '$lib/boards'

	const {
		elements: { trigger, overlay, content, portalled },
		states: { open }
	} = createDialog()
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay" />
		<div transition:fly={{ y: -30 }} use:melt={$content} class="menu surface-2">
			<Nav on:board-change={() => ($open = false)} />

			<div>
				<ThemeSwitcher />
			</div>
		</div>
	{/if}
</div>

<button use:melt={$trigger} class:open={$open} class="heading-xl board-btn">
	<span>{$boards.currentBoard.name}</span>
	<Icon name="ChevronDown" />
</button>

<style lang="postcss">
	.board-btn {
		display: flex;
		gap: var(--size-2);
		align-items: center;
		color: var(--text-1);
	}

	.board-btn.open :global(svg) {
		transform: rotateX(180deg);
	}
	.menu {
		display: grid;
		grid-template-rows: 1fr;
		position: fixed;
		border-radius: var(--radius-3);
		z-index: 50;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 2 * var(--size-3));
		max-width: 264px;
		padding-inline-end: var(--size-5);
		padding-block: var(--size-4);
	}

	.menu > div:last-child {
		padding-inline-start: var(--size-5);
	}
</style>
