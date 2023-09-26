<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Icon } from '$lib/components'
	import { boards } from '$lib/boards'
	import type { Board } from '$lib/types'

	const dispatch = createEventDispatcher()

	function onBoardChange(board: Board) {
		if ($boards.selectedBoard !== board.name) {
			boards.selectBoard(board)
			dispatch('board-change')
		}
	}
</script>

<nav>
	<h3 class="body-m">ALL BOARDS ({$boards.boards.length})</h3>
	{#each $boards.boards as board}
		<button
			on:click={() => onBoardChange(board)}
			class="heading-m"
			class:active={board.name === $boards.selectedBoard}
		>
			<span>
				<Icon name="Board" />
				{board.name}
			</span>
		</button>
	{/each}
	<button class="heading-m"><span><Icon name="Board" /> + Create New Board</span></button>
</nav>

<style lang="postcss">
	nav > * {
		padding-inline-start: var(--size-5);
	}

	nav {
		display: grid;
		margin-bottom: var(--size-3);

		& h3 {
			margin-block-end: var(--size-3);
			color: var(--text-2);
			letter-spacing: 0.3em;
			margin-bottom: var(--size-6);
		}

		& button {
			display: flex;
			align-items: center;
			height: 48px;
		}

		& button > span {
			display: flex;
			align-items: center;
			gap: var(--size-2);
		}

		& button.active {
			color: white;
			background-color: var(--primary-1);
			border-end-end-radius: var(--radius-round);
			border-start-end-radius: var(--radius-round);
		}

		& button.active :global(svg path) {
			fill: white;
		}

		& button:last-child {
			color: var(--primary-1);
		}

		& button:last-child :global(svg path) {
			fill: var(--primary-1);
		}
	}
</style>
