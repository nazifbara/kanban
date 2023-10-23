<script lang="ts">
	import { writable } from 'svelte/store'
	import { getContext } from 'svelte'

	import {
		Icon,
		MenuBtn,
		EllipsisPopover,
		NewTaskBtn,
		BoardForm,
		AlertDialog
	} from '$lib/components'
	import { boards, currentBoard, currentColumns } from '$lib/boards'
	import type { EditBoardContext } from '$lib/types'

	const editBoardOpen = getContext<EditBoardContext>('editBoardOpen')

	let isDeleting = writable(false)
</script>

<header class="surface-2">
	<h1 class="heading-xl">{$currentBoard && $currentBoard.name}</h1>
	<div class="left">
		<Icon name="LogoMobile" />

		<MenuBtn />
	</div>

	<div>
		<NewTaskBtn />
		<EllipsisPopover
			onEdit={() => editBoardOpen.open()}
			onDelete={() => ($isDeleting = true)}
			targetName="Board"
		/>
	</div>

	{#if $currentBoard}
		<AlertDialog
			isOpen={isDeleting}
			on:confirm={() => $currentBoard && boards.deleteBoard($currentBoard, $currentColumns)}
		>
			<svelte:fragment slot="title">Delete this board?</svelte:fragment>
			Are you sure you want to delete the '{$currentBoard.name}' board? This action will remove all
			columns and tasks and cannot be reversed.
		</AlertDialog>
	{/if}
	{#key $currentBoard}
		<BoardForm
			isOpen={editBoardOpen.editingBoard}
			type="edit"
			data={{ ...$currentBoard, columns: $currentColumns }}
		/>
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
