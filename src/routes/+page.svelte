<script lang="ts">
	import { writable } from 'svelte/store'
	import { getContext } from 'svelte'
	import { scale } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'
	import Sortable from 'sortablejs'

	import {
		SubtaskCheckbox,
		Dropdown,
		EllipsisPopover,
		TaskForm,
		BoardForm,
		AlertDialog,
		Icon
	} from '$lib/components'
	import {
		currentBoard,
		currentColumns,
		tasksByColumn,
		columnTasks,
		columnsByBoard
	} from '$lib/boards'
	import type { Task, Subtask, EditBoardContext, ToastContext } from '$lib/types'

	let editingTask = writable(false)
	let deletingTask = writable(false)
	let isAddingBoard = writable(false)
	let selectedTask: Task | null = null
	let editBoardOpen = getContext<EditBoardContext>('editBoardOpen')
	const showToast = getContext<ToastContext>('toast').showToast

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

	function dndTask(node: HTMLElement) {
		Sortable.create(node, {
			group: 'tasks',
			animation: 150,
			handle: '.task__handle',
			ghostClass: 'sortable-ghost',

			onEnd: ({ oldIndex, newIndex, from, to }) => {
				const columnIdFrom = from.getAttribute('data-columnId') as string
				const columnIdTo = to.getAttribute('data-columnId') as string
				const columnLabelTo = to.getAttribute('data-labelTo') as string

				if (oldIndex !== undefined && newIndex !== undefined) {
					if (columnIdFrom === columnIdTo) {
						tasksByColumn.update((v) => {
							;[v[columnIdFrom][oldIndex], v[columnIdFrom][newIndex]] = [
								v[columnIdFrom][newIndex],
								v[columnIdFrom][oldIndex]
							]
							return { ...v }
						})
					} else {
						tasksByColumn.update((v) => {
							const [task] = v[columnIdFrom].splice(oldIndex, 1)
							v[columnIdTo].splice(newIndex, 0, {
								...task,
								status: { value: columnIdTo, label: columnLabelTo }
							})
							return { ...v }
						})
					}
				}
			}
		})
	}

	function dndColumn(node: HTMLElement) {
		Sortable.create(node, {
			group: 'columns',
			animation: 150,
			handle: '.column__title',
			ghostClass: 'sortable-ghost',

			onEnd: ({ oldIndex, newIndex }) => {
				if (oldIndex !== undefined && newIndex !== undefined) {
					columnsByBoard.update((v) => {
						;[v[$currentBoard?.id ?? ''][oldIndex], v[$currentBoard?.id ?? ''][newIndex]] = [
							v[$currentBoard?.id ?? ''][newIndex],
							v[$currentBoard?.id ?? ''][oldIndex]
						]
						return { ...v }
					})
				}
			}
		})
	}
</script>

<div use:melt={$portalled}>
	{#if $open && selectedTask}
		<div use:melt={$overlay} class="overlay z-1" />

		<article transition:scale use:melt={$content} class="task-modal modal-shell surface-2 z-2">
			<header class="task-modal__header">
				<h3 use:melt={$title} class="text text--heading-l">{selectedTask.title}</h3>
				<EllipsisPopover
					onEdit={() => ($editingTask = true)}
					onDelete={() => ($deletingTask = true)}
					targetName="Task"
				/>
			</header>
			<p use:melt={$description}>{selectedTask.description}</p>

			{#if selectedTask.subtasks[0]}
				<div>
					<h4 class="task-modal__heading text text--heading-s">
						Subtasks ({completionCount(selectedTask.subtasks)} of {selectedTask.subtasks.length})
					</h4>

					<ul>
						{#each selectedTask.subtasks as subtask}
							<li class="task-modal__subtask">
								<SubtaskCheckbox bind:checked={subtask.isCompleted}>
									{subtask.title}
								</SubtaskCheckbox>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div>
				<h4 class="task-modal__heading text text--heading-s">Current Status</h4>

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
		<div class="columns" use:dndColumn>
			{#each $currentColumns as column, i (column.id)}
				<section class="columns__item">
					<h2 class="columns__item__title text text--heading-s">
						<button aria-label="Drag column">
							<Icon name="DnD" />
						</button>
						{column.name} ({$columnTasks[i].length})
					</h2>
					<div
						class="columns__item__content"
						data-columnId={column.id}
						data-labelTo={column.name}
						use:dndTask
					>
						{#each $columnTasks[i] as task (task.id)}
							<article class="task surface-2">
								<button aria-label="Drag task" class="task__handle">
									<Icon name="DnD" />
								</button>
								<div>
									<button
										class="task__title text text--heading-m"
										use:melt={$trigger}
										on:click={() => selectTask(task)}
									>
										{task.title}
									</button>
									{#if task.subtasks.length !== 0}
										<p class="text text--body-m">{completionText(task.subtasks)}</p>
									{/if}
								</div>
							</article>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="empty-message">
			<div>
				<p>This board is empty. Create a new column to get started.</p>
				<button class="btn btn--primary btn--large" on:click={() => editBoardOpen.open()}>
					+ Add New Column
				</button>
			</div>
		</div>
	{/if}
{:else}
	<div class="empty-message">
		<div>
			<p>There is no board, so let's create a new one.</p>
			<button class="btn btn--primary btn--large" on:click={() => ($isAddingBoard = true)}>
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
			showToast('Task deleted!')
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

	:global(.sortable-ghost) {
		border: 2px solid var(--primary-1);
	}

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

	.task-modal__header {
		display: grid;
		gap: var(--size-2);
		grid-template-columns: 1fr auto;
		justify-content: space-between;
		align-items: center;
	}

	.task-modal__subtask:not(:last-child) {
		margin-block-end: var(--size-2);
	}

	.task-modal__heading {
		margin-block-end: var(--size-3);
	}
	.columns {
		display: flex;
		gap: var(--size-5);
		width: max-content;
		min-width: 100%;
	}

	.columns__item {
		width: 280px;
	}

	.columns__item__title {
		display: flex;
		gap: var(--size-2);
		align-items: center;
		text-transform: uppercase;
		color: var(--text-2);
		padding-inline: var(--size-3);
		letter-spacing: 0.3em;
		margin-block-end: var(--radius-4);

		& :global(svg path) {
			fill: #49c4e5;
		}
	}

	.columns__item__content {
		display: grid;
		align-items: start;
		gap: var(--size-4);
		min-height: 100px;
	}

	.task {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		padding-block: var(--size-5);
		padding-inline: var(--size-3);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-1);
		transition: box-shadow 300ms var(--ease-3);

		&:hover {
			box-shadow: var(--shadow-2);
		}
	}

	.task__title {
		margin-block-end: var(--size-2);
		color: var(--text-1);
		text-align: initial;

		&:hover {
			text-decoration: underline;
		}
	}

	.task__handle {
		padding-block: var(--size-2);
		padding-inline-end: var(--size-3);
	}
</style>
