<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import { Icon, BoardForm } from '$lib/components'
	import { boards } from '$lib/boards'

	const dispatch = createEventDispatcher()
	const isAddingBoard = writable(false)

	$: currentBoard = $boards.items[$boards.currentBoardIndex]

	function onBoardChange(index: number) {
		if ($boards.currentBoardIndex !== index) {
			boards.selectBoard(index)
			dispatch('board-change')
		}
	}
</script>

<BoardForm isOpen={isAddingBoard} type="create" />

<nav>
	<h3 class="body-m">ALL BOARDS ({$boards.items.length})</h3>
	{#each $boards.items as board, i}
		<button
			on:click={() => onBoardChange(i)}
			class="nav-item"
			class:active={board.name === currentBoard.name}
		>
			<span>
				<Icon name="Board" />
				{board.name}
			</span>
		</button>
	{/each}
	<button class="nav-item" on:click={() => ($isAddingBoard = true)}
		><span><Icon name="Board" /> + Create New Board</span></button
	>
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

		& .nav-item:last-child {
			color: var(--primary-1);

			&:hover {
				background-color: transparent;
			}

			& :global(svg path) {
				fill: var(--primary-1);
			}
		}
	}
</style>
