<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { createDialog, createSwitch, melt } from '@melt-ui/svelte'

	import { Icon } from '$lib/components'
	import { boards } from '$lib/boards'

	const {
		elements: { trigger, overlay, content, portalled },
		states: { open }
	} = createDialog()

	const {
		elements: { root, input }
	} = createSwitch()
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div transition:fade use:melt={$overlay} class="overlay" />
		<div transition:fly={{ y: -30 }} use:melt={$content} class="menu surface-2">
			<nav>
				<h3 class="body-m">ALL BOARDS ({$boards.boards.length})</h3>
				{#each $boards.boards as board}
					<button class="heading-m" class:active={board.name === $boards.selectedBoard}>
						<span>
							<Icon name="Board" />
							{board.name}
						</span>
					</button>
				{/each}
				<button class="heading-m"><span><Icon name="Board" /> + Create New Board</span></button>
			</nav>

			<div>
				<div class="theme-switcher-wrapper surface-1">
					<div use:melt={$root} class="theme-switcher">
						<Icon name="LightTheme" />
						<button>
							<span />
						</button>
						<Icon name="DarkTheme" />
						<input use:melt={$input} />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<header class="surface-2">
	<h1 class="heading-xl">{$boards.selectedBoard}</h1>
	<div class="left">
		<Icon name="LogoMobile" />

		<button use:melt={$trigger} class:open={$open} class="heading-xl board-btn">
			<span>{$boards.selectedBoard}</span>
			<Icon name="ChevronDown" />
		</button>
	</div>

	<div class="right">
		<button class="btn primary large"> + Add New Task </button>

		<button class="btn primary large" aria-label="Add New Task">
			<Icon name="AddTaskMobile" />
		</button>

		<button>
			<Icon name="VerticalEllipsis" />
		</button>
	</div>
</header>

<style lang="postcss">
	@import 'open-props/media';

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-inline: var(--size-3);
		height: 64px;

		& > div {
			display: flex;
			gap: var(--size-3);
		}
	}

	h1 {
		display: none;
	}

	.board-btn {
		display: flex;
		gap: var(--size-2);
		align-items: center;
	}

	.board-btn.open :global(svg) {
		transform: rotateX(180deg);
	}

	.right button:first-child {
		display: none;
	}

	.theme-switcher-wrapper {
		display: flex;
		justify-content: center;
		padding-block: var(--size-3);
		border-radius: var(--radius-3);
	}

	.theme-switcher {
		display: flex;
		align-items: center;
		gap: var(--size-4);

		& button {
			position: relative;
			width: 40px;
			height: 20px;
			border-radius: var(--radius-round);
			background-color: var(--primary-1);
		}

		& span {
			--size: 14px;
			--padding: 3px;
			position: absolute;
			top: var(--padding);
			left: var(--padding);
			width: var(--size);
			height: var(--size);
			border-radius: var(--radius-round);
			background-color: white;
			transition: left 300ms var(--ease-spring-5);
		}

		&[data-state='checked'] span {
			left: calc(100% - var(--padding) - var(--size));
		}
	}

	.menu {
		display: grid;
		grid-template-rows: 1fr;
		position: fixed;
		border-radius: var(--radius-3);
		z-index: 50;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 2 * var(--size-3));
		max-width: 264px;
		padding-inline-end: var(--size-5);
		padding-block: var(--size-4);
	}

	.menu > div:last-child,
	nav > * {
		padding-inline-start: var(--size-5);
	}

	nav {
		display: grid;
		margin-bottom: var(--size-3);

		& h3 {
			margin-block-end: var(--size-3);
			color: var(--text-2);
			letter-spacing: 0.3em;
			margin-bottom: var(--size-6);
		}

		& button {
			display: flex;
			align-items: center;
			height: 48px;
		}

		& button > span {
			display: flex;
			align-items: center;
			gap: var(--size-2);
		}

		& button.active {
			color: var(--text-1);
			background-color: var(--primary-1);
			border-end-end-radius: var(--radius-round);
			border-start-end-radius: var(--radius-round);
		}

		& button.active :global(svg path) {
			fill: var(--text-1);
		}

		& button:last-child {
			color: var(--primary-1);
		}

		& button:last-child :global(svg path) {
			fill: var(--primary-1);
		}
	}

	@media (--md-n-above) {
		header {
			padding-inline: var(--size-5);
			height: 80px;
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

		.right button[aria-label] {
			display: none;
		}

		.right button:first-child {
			display: initial;
		}
	}
</style>
