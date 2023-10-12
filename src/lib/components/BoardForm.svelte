<script lang="ts">
	import type { Writable } from 'svelte/store'
	import { createEventDispatcher } from 'svelte'
	import { scale } from 'svelte/transition'
	import { v4 as uid } from 'uuid'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { getContext } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'

	import { Icon, TextField } from '$lib/components'
	import type { BoardFormData, SuperFormContext } from '$lib/types'

	export let isOpen: Writable<boolean> | undefined = undefined
	export let data: Partial<BoardFormData> = {}
	export let type: 'create' | 'edit' = 'create'

	const { boardForm } = getContext<SuperFormContext>('superForm')
	const { form, constraints, enhance } = superForm(boardForm, {
		dataType: 'json',
		id: uid(),
		onUpdate(event) {
			console.log(event.form.data)
			data = event.form.data
		}
	})

	form.update((v) => ({ ...v, ...data }))

	const {
		elements: { overlay, content, title, portalled },
		states: { open }
	} = createDialog({ forceVisible: true, open: isOpen })
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
			class="modal-shell z-4"
		>
			<header>
				<h3 use:melt={$title} class="heading-l">{type == 'create' ? 'Add New' : 'Edit'} Board</h3>
			</header>

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="field">
				<span class="body-m">Name</span>

				<TextField
					name="name"
					placeholder="e.g. Web Design"
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</label>

			<div class="field">
				<span class="body-m">Colomns</span>

				<div class="subtasks">
					{#if $form.columns.length !== 0}
						{#each $form.columns as column, i}
							<div>
								<TextField
									name="subtasks-{i}-title"
									bind:value={$form.columns[i].name}
									{...$constraints.columns?.name}
								/>
								<button
									aria-label="Delete subtask"
									type="button"
									on:click={() => ($form.columns = $form.columns.filter((c) => c !== column))}
								>
									<Icon name="Cross" />
								</button>
							</div>
						{/each}
					{/if}
					<button
						type="button"
						on:click={() => ($form.columns = [...$form.columns, { id: uid(), name: '' }])}
						class="btn secondary">+ Add New Column</button
					>
				</div>
			</div>

			<button class="btn primary">{type == 'create' ? 'Create Column' : 'Save Changes'}</button>
		</form>
	{/if}
</div>

<style lang="postcss">
	@import 'open-props/media';

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
