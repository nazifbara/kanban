<script lang="ts">
	import { boards } from '$lib/boards'
	import type { Subtask } from '$lib/types'

	$: currentBoard = $boards.boards.find((board) => board.name === $boards.selectedBoard)

	function completionText(tasks: Subtask[]) {
		const count = tasks.reduce((prev, curr) => (curr.isCompleted ? prev + 1 : prev), 0)

		return `${count} of ${tasks.length} substasks`
	}
</script>

{#if currentBoard}
	<div class="columns-wrapper">
		{#each currentBoard.columns as column, i}
			<section>
				<h2 class="heading-s">
					<span />
					{column.name} ({column.tasks.length})
				</h2>

				<div>
					{#each column.tasks as task}
						<article class="surface-2">
							<h3 class="heading-m">{task.title}</h3>
							<p class="body-m">{completionText(task.subtasks)}</p>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@import 'open-props/media';

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

	article {
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
