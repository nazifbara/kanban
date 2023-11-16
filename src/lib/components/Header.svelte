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
	import type { EditBoardContext, ToastContext } from '$lib/types'

	const editBoardOpen = getContext<EditBoardContext>('editBoardOpen')
	const showToast = getContext<ToastContext>('toast').showToast

	let isDeleting = writable(false)
</script>

<div class="surface-2 wrapper">
	<header>
		<h1 class="text text--heading-xl">{$currentBoard?.name ?? 'No boards'}</h1>
		<div class="left">
			<Icon name="LogoMobile" />

			<MenuBtn />
		</div>
		{#if $currentBoard}
			<div>
				<NewTaskBtn />
				<EllipsisPopover
					onEdit={() => editBoardOpen.open()}
					onDelete={() => ($isDeleting = true)}
					targetName="Board"
				/>
			</div>

			<AlertDialog
				isOpen={isDeleting}
				on:confirm={() => {
					$currentBoard && boards.deleteBoard($currentBoard, $currentColumns)
					showToast('Board deleted!')
				}}
			>
				<svelte:fragment slot="title">Delete this board?</svelte:fragment>
				Are you sure you want to delete the '{$currentBoard.name}' board? This action will remove
				all columns and tasks and cannot be reversed.
			</AlertDialog>
			{#key $currentBoard}
				<BoardForm
					isOpen={editBoardOpen.editingBoard}
					type="edit"
					data={{ ...$currentBoard, columns: $currentColumns }}
				/>
			{/key}
		{/if}
	</header>
</div>

<style lang="postcss">
	@import 'open-props/media';

	header {
		display: flex;
		justify-content: space-between;
		max-width: 1440px;
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
		}

		.wrapper {
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
