<script lang="ts">
	import { scale } from 'svelte/transition'
	import { createDialog, melt } from '@melt-ui/svelte'

	import { SubtaskCheckbox, Dropdown, EllipsisPopover } from '$lib/components'
	import { boards } from '$lib/boards'
	import type { Task, Subtask } from '$lib/types'

	const {
		elements: { trigger, overlay, content, title, description, portalled },
		states: { open }
	} = createDialog({ forceVisible: true })

	$: currentBoard = $boards.boards.find((board) => board.name === $boards.selectedBoard)

	let selectedTask: Task | null = null

	function selectTask(task: Task) {
		selectedTask = task
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
		<div use:melt={$overlay} class="overlay" />

		<article transition:scale use:melt={$content} class="task-modal-shell task-modal surface-2">
			<header>
				<h3 use:melt={$title} class="heading-l">{selectedTask.title}</h3>
				<EllipsisPopover
					onEdit={() => alert('Edit task')}
					onDelete={() => alert('Delete task')}
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
								<SubtaskCheckbox checked={subtask.isCompleted}>
									{subtask.title}
								</SubtaskCheckbox>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div>
				<h4 class="heading-s">Current Status</h4>

				{#if currentBoard && currentBoard.columns}
					<Dropdown
						buttonLabel={selectedTask.status}
						options={currentBoard?.columns.map((c) => c.name)}
					/>
				{/if}
			</div>
		</article>
	{/if}
</div>

{#if currentBoard}
	<div class="columns-wrapper">
		{#each currentBoard.columns as column}
			<section>
				<h2 class="heading-s">
					<span />
					{column.name} ({column.tasks.length})
				</h2>

				<div>
					{#each column.tasks as task}
						<button use:melt={$trigger} on:click={() => selectTask(task)} class="task surface-2">
							<h3 class="heading-m">{task.title}</h3>
							<p class="body-m">{completionText(task.subtasks)}</p>
						</button>
					{/each}
				</div>
			</section>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@import 'open-props/media';

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
