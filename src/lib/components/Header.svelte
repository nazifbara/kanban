<script lang="ts">
	import { Icon } from '$lib/components'
	import { boards } from '$lib/boards'
</script>

<header class="surface-2">
	<h1 class="heading-xl">{$boards.selectedBoard}</h1>
	<div class="left">
		<Icon name="LogoMobile" />

		<button class="heading-xl board-btn">
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

	.right button:first-child {
		display: none;
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
