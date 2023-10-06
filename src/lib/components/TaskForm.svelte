<script lang="ts">
	import type { Writable } from 'svelte/store'
	import { scale } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'
	import { getContext } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'

	import { Icon, TextField, Dropdown } from '$lib/components'
	import { boards, columns, tasks } from '$lib/boards'
	import type { SuperFormContext } from '$lib/types'

	export let isOpen: Writable<boolean> | undefined = undefined

	const { taskForm } = getContext<SuperFormContext>('superForm')

	const { form, constraints, enhance, posted, errors, reset } = superForm(taskForm, {
		dataType: 'json'
	})

	const {
		elements: { overlay, content, title, portalled },
		states: { open }
	} = createDialog({ forceVisible: true, open: isOpen })

	$: status = $columns[$boards.currentBoard.id].map((c) => ({ label: c.name, value: c.id }))
	$: form.update((value) => ({ ...value, status: status ? status[0] : { label: '', value: '' } }), {
		taint: false
	})
	$: if ($posted && Object.keys($errors).length === 0) {
		tasks.addTask({
			...$form,
			subtasks: $form.subtasks.map((s) => ({ isCompleted: false, title: s }))
		})
		reset({ data: { status: $form.status } })
	}
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay" />

		<form method="post" use:enhance transition:scale use:melt={$content} class="task-modal-shell">
			<header>
				<h3 use:melt={$title} class="heading-l">Add New Task</h3>
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
									name="subtasks"
									bind:value={$form.subtasks[i]}
									{...$constraints.subtasks}
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
						on:click={() => ($form.subtasks = [...$form.subtasks, ''])}
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

			<button class="btn primary">Create Task</button>
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
