<script lang="ts">
	import { writable } from 'svelte/store'
	import { getContext } from 'svelte'
	import { scale } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'

	import {
		SubtaskCheckbox,
		Dropdown,
		EllipsisPopover,
		TaskForm,
		BoardForm,
		AlertDialog
	} from '$lib/components'
	import { currentBoard, currentColumns, tasksByColumn, columnTasks } from '$lib/boards'
	import type { Task, Subtask, EditBoardContext } from '$lib/types'

	let editingTask = writable(false)
	let deletingTask = writable(false)
	let isAddingBoard = writable(false)
	let selectedTask: Task | null = null
	let editBoardOpen = getContext<EditBoardContext>('editBoardOpen')

	$: if (selectedTask) tasksByColumn.editTask(selectedTask.id, selectedTask)

	const {
		elements: { trigger, overlay, content, title, description, portalled },
		states: { open }
	} = createDialog({ forceVisible: true })

	function selectTask(task: Task) {
		selectedTask = task
	}

	function unselectTask() {
		selectedTask = null
	}

	function completionText(subtasks: Subtask[]) {
		return `${completionCount(subtasks)} of ${subtasks.length} substasks`
	}

	function completionCount(subtasks: Subtask[]) {
		return subtasks.reduce((prev, curr) => (curr.isCompleted ? prev + 1 : prev), 0)
	}
</script>

<div use:melt={$portalled}>
	{#if $open && selectedTask}
		<div use:melt={$overlay} class="overlay z-1" />

		<article transition:scale use:melt={$content} class="modal-shell task-modal surface-2 z-2">
			<header>
				<h3 use:melt={$title} class="heading-l">{selectedTask.title}</h3>
				<EllipsisPopover
					onEdit={() => ($editingTask = true)}
					onDelete={() => ($deletingTask = true)}
					targetName="Task"
				/>
			</header>
			<p use:melt={$description}>{selectedTask.description}</p>

			{#if selectedTask.subtasks[0]}
				<div>
					<h4 class="heading-s">
						Subtasks ({completionCount(selectedTask.subtasks)} of {selectedTask.subtasks.length})
					</h4>

					<ul>
						{#each selectedTask.subtasks as subtask}
							<li>
								<SubtaskCheckbox bind:checked={subtask.isCompleted}>
									{subtask.title}
								</SubtaskCheckbox>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div>
				<h4 class="heading-s">Current Status</h4>

				{#if $currentBoard && $currentColumns}
					<Dropdown
						buttonLabel={selectedTask.status.label}
						on:change={(e) => {
							if (selectedTask) {
								const newSelectedTask = { ...selectedTask, status: { ...e.detail } }
								tasksByColumn.deleteTask(selectedTask)
								tasksByColumn.addTask(newSelectedTask)
								selectedTask = newSelectedTask
							}
						}}
						options={$currentColumns.map((c) => ({
							label: c.name,
							value: c.id
						}))}
					/>
				{/if}
			</div>
		</article>
	{/if}
</div>

{#if $currentBoard}
	{#if $currentColumns.length > 0}
		<div class="columns-wrapper">
			{#each $currentColumns as column, i}
				<section>
					<h2 class="heading-s">
						<span />
						{column.name} ({$columnTasks[i].length})
					</h2>
					<div>
						{#each $columnTasks[i] as task}
							<button use:melt={$trigger} on:click={() => selectTask(task)} class="task surface-2">
								<h3 class="heading-m">{task.title}</h3>
								<p class="body-m">{completionText(task.subtasks)}</p>
							</button>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="empty-message">
			<div>
				<p>This board is empty. Create a new column to get started.</p>
				<button class="btn primary large" on:click={() => editBoardOpen.open()}>
					+ Add New Column
				</button>
			</div>
		</div>
	{/if}
{:else}
	<div class="empty-message">
		<div>
			<p>There is no board, so let's create a new one.</p>
			<button class="btn primary large" on:click={() => ($isAddingBoard = true)}>
				+ Create New Board
			</button>
		</div>
	</div>

	<BoardForm isOpen={isAddingBoard} type="create" />
{/if}

{#if selectedTask}
	<TaskForm
		on:new-task={(e) => (selectedTask = { ...e.detail })}
		type="edit"
		isOpen={editingTask}
		bind:data={selectedTask}
	/>

	<AlertDialog
		isOpen={deletingTask}
		on:confirm={() => {
			$editingTask = false
			selectedTask && tasksByColumn.deleteTask(selectedTask)
			unselectTask()
		}}
	>
		<svelte:fragment slot="title">Delete this Task?</svelte:fragment>

		<svelte:fragment>
			Are you sure you want to delete the '{selectedTask.title}' task and its subtasks? This action
			cannot be reversed.
		</svelte:fragment>
	</AlertDialog>
{/if}

<style lang="postcss">
	@import 'open-props/media';

	.empty-message {
		display: grid;
		place-content: center;
		justify-content: center;
		height: 100%;
		text-align: center;

		p {
			color: var(--text-2);
			margin-block-end: var(--size-6);
		}
	}

	.task-modal {
		& header {
			display: grid;
			gap: var(--size-2);
			grid-template-columns: 1fr auto;
			justify-content: space-between;
			align-items: center;
		}

		& li:not(:last-child) {
			margin-block-end: var(--size-2);
		}

		& h4 {
			margin-block-end: var(--size-3);
		}
	}

	.columns-wrapper {
		display: flex;
		gap: var(--size-5);
		width: max-content;
		min-width: 100%;
	}

	section {
		width: 280px;

		& > div {
			display: grid;
			gap: var(--size-4);
		}
	}

	h2 {
		display: flex;
		gap: var(--size-2);
		align-items: center;
		text-transform: uppercase;
		color: var(--text-2);
		letter-spacing: 0.3em;
		margin-block-end: var(--radius-4);

		& span {
			display: block;
			width: 14px;
			height: 14px;
			border-radius: var(--radius-round);
			background-color: #49c4e5;
		}
	}

	.task {
		text-align: initial;
		padding-block: var(--size-5);
		padding-inline: var(--size-3);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-1);
		transition: box-shadow 300ms var(--ease-3);
		cursor: pointer;

		& h3 {
			margin-block-end: var(--size-2);
		}
	}

	article:hover {
		box-shadow: var(--shadow-2);
	}
</style>
