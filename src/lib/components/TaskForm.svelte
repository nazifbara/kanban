<script lang="ts">
	import type { Writable } from 'svelte/store'
	import { createEventDispatcher } from 'svelte'
	import { scale } from 'svelte/transition'
	import { v4 as uid } from 'uuid'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { getContext } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'

	import { Icon, TextField, Dropdown } from '$lib/components'
	import { boards, columns, tasks } from '$lib/boards'
	import type { SuperFormContext, Task } from '$lib/types'

	export let isOpen: Writable<boolean> | undefined = undefined
	export let data: Partial<Task> = {}
	export let type: 'create' | 'edit' = 'create'

	const dispatch = createEventDispatcher()
	const { taskForm } = getContext<SuperFormContext>('superForm')
	const { form, constraints, enhance, posted, errors, reset } = superForm(taskForm, {
		dataType: 'json',
		id: uid()
	})

	const {
		elements: { overlay, content, title, portalled },
		states: { open }
	} = createDialog({ forceVisible: true, open: isOpen })

	$: status = $columns[$boards.items[$boards.currentBoardIndex].id].map((c) => ({
		label: c.name,
		value: c.id
	}))
	$: form.update(
		(value) => ({ ...value, status: status ? status[0] : { label: '', value: '' }, ...data }),
		{
			taint: false
		}
	)
	$: if ($posted && Object.keys($errors).length === 0) {
		if (type === 'create') {
			tasks.addTask($form)
			reset({ data: { status: $form.status } })
		} else {
			if (data.id) {
				tasks.editTask(data.id, { ...$form })
				dispatch('new-task', { id: data.id, ...$form })
			}
			$open = false
			reset()
		}
	}
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay z-2" />

		<form
			method="post"
			action="?/task"
			use:enhance
			transition:scale
			use:melt={$content}
			class="modal-shell z-4"
		>
			<header>
				<h3 use:melt={$title} class="heading-l">{type == 'create' ? 'Add New' : 'Edit'} Task</h3>
			</header>

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="field">
				<span class="body-m">Title</span>

				<TextField
					name="title"
					placeholder="e.g Take a coffee break"
					bind:value={$form.title}
					{...$constraints.title}
				/>
			</label>

			<label class="field">
				<span class="body-m">Description</span>

				<textarea
					name="description"
					placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
					class="input"
					bind:value={$form.description}
				/>
			</label>

			<div class="field">
				<span class="body-m">Subtasks</span>

				<div class="subtasks">
					{#if $form.subtasks.length !== 0}
						{#each $form.subtasks as _, i}
							<div>
								<TextField
									name="subtasks-{i}-title"
									bind:value={$form.subtasks[i].title}
									{...$constraints.subtasks?.title}
								/>
								<button
									aria-label="Delete subtask"
									type="button"
									on:click={() =>
										($form.subtasks = [
											...$form.subtasks.slice(0, i),
											...$form.subtasks.slice(i + 1)
										])}
								>
									<Icon name="Cross" />
								</button>
							</div>
						{/each}
					{/if}
					<button
						type="button"
						on:click={() =>
							($form.subtasks = [...$form.subtasks, { title: '', isCompleted: false }])}
						class="btn secondary">+ Add New Subtask</button
					>
				</div>
			</div>

			{#if status}
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<div class="field">
					<span class="body-m">Title</span>

					<Dropdown options={status} name="status" bind:selected={$form.status} />
				</div>
			{/if}

			<button class="btn primary">{type == 'create' ? 'Create Task' : 'Save Changes'}</button>
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

	textarea {
		height: 112px;
		resize: none;
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
