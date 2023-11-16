<script lang="ts">
	import { writable, type Writable } from 'svelte/store'
	import { scale } from 'svelte/transition'
	import { v4 as uid } from 'uuid'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { getContext } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'

	import { Icon, TextField, AlertDialog } from '$lib/components'
	import type { BoardFormData, Container, SuperFormContext, ToastContext } from '$lib/types'
	import { columnsByBoard, boards } from '$lib/boards'

	export let isOpen: Writable<boolean> | undefined = undefined
	export let data: Partial<BoardFormData> = {}
	export let type: 'create' | 'edit' = 'create'

	let isDeletingColumn = writable(false)
	let columnOnDeletion: Container | null = null
	let idInput: HTMLInputElement

	const { boardForm } = getContext<SuperFormContext>('superForm')
	const showToast = getContext<ToastContext>('toast').showToast

	const { form, constraints, posted, errors, enhance, reset } = superForm(boardForm, {
		dataType: 'json',
		id: uid(),
		onUpdate(event) {
			data = event.form.data
		}
	})

	form.update((v) => ({ ...v, ...data }))

	const {
		elements: { overlay, content, title, portalled },
		states: { open }
	} = createDialog({ forceVisible: true, open: isOpen })

	function deleteColumn(column: Container, board: Container) {
		columnsByBoard.deleteColumn(column, board)
	}

	$: if ($posted && Object.keys($errors).length <= 1) {
		if (type === 'edit') {
			boards.editBoard($form)
			columnsByBoard.saveColumns($form, $form.columns)
			showToast('Changes saved!')
		} else {
			if ($errors.id !== undefined) {
				boards.addBoard({ ...$form, id: uid() }, $form.columns)
				showToast('Board created!')
			}
		}
		reset()
		$isOpen = false
	}
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay z-2" />

		<form
			method="post"
			action="?/board"
			use:enhance
			transition:scale
			use:melt={$content}
			class="modal-shell z-3"
		>
			<header>
				<h3 use:melt={$title} class="text text--heading-l">
					{type == 'create' ? 'Add New' : 'Edit'} Board
				</h3>
			</header>

			<input class="idInput" bind:this={idInput} type="text" bind:value={$form.id} />
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="field">
				<span class="text text--body-m">Name</span>

				<TextField
					name="name"
					placeholder="e.g. Web Design"
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</label>

			<div class="field">
				<span class="text text--body-m">Colomns</span>

				<div class="subtasks">
					{#if $form.columns.length !== 0}
						{#each $form.columns as column, i}
							{#if columnOnDeletion && columnOnDeletion.id === column.id}
								<AlertDialog
									isOpen={isDeletingColumn}
									on:confirm={() => {
										deleteColumn(column, $form)
										$form.columns = $form.columns.filter((c) => c.id !== column.id)
									}}
								>
									<svelte:fragment slot="title">Delete this column?</svelte:fragment>
									Are you sure you want to delete the '{column.name}' column? This action will
									remove all tasks and cannot be reversed.
								</AlertDialog>
							{/if}

							<div>
								<TextField
									name="subtasks-{i}-title"
									bind:value={$form.columns[i].name}
									{...$constraints.columns?.name}
								/>
								<button
									aria-label="Delete subtask"
									type="button"
									on:click={() => {
										$isDeletingColumn = true
										columnOnDeletion = column
									}}
								>
									<Icon name="Cross" />
								</button>
							</div>
						{/each}
					{/if}
					<button
						type="button"
						on:click={() => ($form.columns = [...$form.columns, { id: uid(), name: '' }])}
						class="btn btn--secondary">+ Add New Column</button
					>
				</div>
			</div>

			<button on:click={() => type === 'create' && (idInput.value = uid())} class="btn btn--primary"
				>{type == 'create' ? 'Create Board' : 'Save Changes'}</button
			>
		</form>
	{/if}
</div>

<style lang="postcss">
	@import 'open-props/media';
	.idInput {
		display: none;
	}
	.subtasks {
		display: grid;
		gap: var(--size-3);

		& > div {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: var(--size-3);
		}
	}

	.field {
		display: grid;
		gap: var(--size-2);

		& span {
			color: var(--text-2);
		}
	}

	.new-task:not([aria-label]) {
		display: none;
	}

	@media (--md-n-above) {
		.new-task[aria-label] {
			display: none;
		}

		.new-task:not([aria-label]) {
			display: initial;
		}
	}
</style>
