<script lang="ts">
	import { scale } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'

	import { Icon, TextField, Dropdown } from '$lib/components'
	import { boards } from '$lib/boards'

	const {
		elements: { trigger, overlay, content, title, portalled },
		states: { open }
	} = createDialog({ forceVisible: true })

	let subtasks: string[] = []

	$: currentBoard = $boards.boards.find((board) => board.name === $boards.selectedBoard)
	$: status = currentBoard?.columns.map((c) => c.name)
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay" />

		<form transition:scale use:melt={$content} class="task-modal-shell">
			<header>
				<h3 use:melt={$title} class="heading-l">Add New Task</h3>
			</header>

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="field">
				<span class="body-m">Title</span>

				<TextField name="title" placeholder="e.g Take a coffee break" />
			</label>

			<label class="field">
				<span class="body-m">Description</span>

				<textarea
					name="description"
					placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
					class="input"
				/>
			</label>

			<div class="field">
				<span class="body-m">Subtasks</span>

				<div class="subtasks">
					{#if subtasks.length !== 0}
						{#each subtasks as subtask, i}
							<div>
								<TextField value={subtask} />
								<button
									aria-label="Delete subtask"
									type="button"
									on:click={() => (subtasks = [...subtasks.slice(0, i), ...subtasks.slice(i + 1)])}
								>
									<Icon name="Cross" />
								</button>
							</div>
						{/each}
					{/if}
					<button
						type="button"
						on:click={() => (subtasks = [...subtasks, ''])}
						class="btn secondary">+ Add New Subtask</button
					>
				</div>
			</div>

			{#if status}
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<div class="field">
					<span class="body-m">Title</span>

					<Dropdown options={status} name="status" />
				</div>
			{/if}

			<button class="btn primary">Create Task</button>
		</form>
	{/if}
</div>

<button use:melt={$trigger} class="new-task btn primary large"> + Add New Task </button>

<button use:melt={$trigger} class="new-task btn primary large" aria-label="Add New Task">
	<Icon name="AddTaskMobile" />
</button>

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
