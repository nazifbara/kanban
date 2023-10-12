<script lang="ts">
	import { writable } from 'svelte/store'
	import { Icon, MenuBtn, EllipsisPopover, NewTaskBtn, BoardForm } from '$lib/components'
	import { boards, columns as columnStore } from '$lib/boards'

	let isEditing = writable<boolean>(false)

	$: currentBoard = $boards.items[$boards.currentBoardIndex]
	$: columns = $columnStore[currentBoard.id]
</script>

<header class="surface-2">
	<h1 class="heading-xl">{currentBoard && currentBoard.name}</h1>
	<div class="left">
		<Icon name="LogoMobile" />

		<MenuBtn />
	</div>

	<div>
		<NewTaskBtn />

		<EllipsisPopover
			onEdit={() => ($isEditing = true)}
			onDelete={() => alert('Delete Board')}
			targetName="Board"
		/>
	</div>

	{#key currentBoard}
		<BoardForm isOpen={isEditing} type="edit" data={{ ...currentBoard, columns }} />
	{/key}
</header>

<style lang="postcss">
	@import 'open-props/media';

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-inline: var(--size-3);
		height: var(--header-height);

		& > div {
			display: flex;
			gap: var(--size-3);
		}
	}

	h1 {
		display: none;
	}

	@media (--md-n-above) {
		header {
			padding-inline: var(--size-5);
			border-bottom: 1px solid var(--border);
		}

		header > div {
			gap: var(--size-5);
		}

		h1 {
			display: initial;
		}

		.left {
			display: none;
		}
	}
</style>
