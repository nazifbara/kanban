<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import { Icon, BoardForm } from '$lib/components'
	import { boards, currentBoard } from '$lib/boards'

	const dispatch = createEventDispatcher()
	const isAddingBoard = writable(false)

	function onBoardChange(index: number) {
		if ($boards.currentBoardIndex !== index) {
			boards.selectBoard(index)
			dispatch('board-change')
		}
	}
</script>

<BoardForm isOpen={isAddingBoard} type="create" />

<nav class="nav">
	<h3 class="nav__heading text text-body-m">ALL BOARDS ({$boards.items.length})</h3>
	{#each $boards.items as board, i}
		<button
			on:click={() => onBoardChange(i)}
			class="nav__item"
			class:nav__item--active={$currentBoard && board.name === $currentBoard.name}
		>
			<span>
				<Icon name="Board" />
				{board.name}
			</span>
		</button>
	{/each}
	<button class="nav__item" on:click={() => ($isAddingBoard = true)}
		><span><Icon name="Board" /> + Create New Board</span></button
	>
</nav>

<style lang="postcss">
	.nav {
		display: grid;
		margin-bottom: var(--size-3);
	}

	.nav__heading {
		margin-block-end: var(--size-3);
		color: var(--text-2);
		letter-spacing: 0.3em;
		margin-bottom: var(--size-6);
		padding-inline-start: var(--size-5);
	}

	.nav__item {
		--_bg-clr: var(--bg-clr, transparent);
		--_bg-hover: var(--bg-hover, transparent);
		--_text-clr: var(--text-clr, inherit);
		--_text-clr-hover: var(--text-clr-hover, var(--primary-1));

		display: flex;
		align-items: center;
		height: 4rem;
		border-end-end-radius: var(--radius-round);
		border-start-end-radius: var(--radius-round);
		padding-inline-start: var(--size-5);
		padding-inline-end: var(--size-3);
		font-size: var(--font-size-3);
		background-color: var(--_bg-clr);
		color: var(--_text-clr);
		transition: background-color 300ms var(--ease-5);

		&:hover {
			--_bg-clr: var(--_bg-hover);
			--_text-clr: var(--_text-clr-hover);

			:global(svg path) {
				fill: var(--primary-1);
			}
		}

		:global([color-scheme='dark']) &:is(:not(.nav__item--active)):not(:last-child) {
			--bg-hover: white;
		}

		:global([color-scheme='light']) &:is(:not(.nav__item--active)):not(:last-child) {
			--bg-hover: hsl(var(--primary-1-hsl) / 10%);
		}

		& > span {
			display: flex;
			align-items: center;
			gap: var(--size-2);
		}

		&:last-child {
			--text-clr: var(--primary-1);
			--bg-hover: transparent;

			& :global(svg path) {
				fill: var(--primary-1);
			}
		}
	}

	.nav__item--active {
		--text-clr: white;
		--text-clr-hover: var(--text-clr);
		--bg-clr: var(--primary-1);
		--bg-hover: var(--bg-clr);

		:global(svg path) {
			fill: white;
		}

		&:hover :global(svg path) {
			fill: white;
		}
	}
</style>
