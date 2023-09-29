<script lang="ts">
	import { Icon, MenuBtn, EllipsisPopover, NewTaskBtn } from '$lib/components'
	import { boards } from '$lib/boards'
</script>

<header class="surface-2">
	<h1 class="heading-xl">{$boards.selectedBoard}</h1>
	<div class="left">
		<Icon name="LogoMobile" />

		<MenuBtn />
	</div>

	<div>
		<NewTaskBtn />

		<EllipsisPopover
			onEdit={() => alert('Edit Board')}
			onDelete={() => alert('Delete Board')}
			targetName="Board"
		/>
	</div>
</header>

<style lang="postcss">
	@import 'open-props/media';

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-inline: var(--size-3);
		height: var(--header-height);

		& > div {
			display: flex;
			gap: var(--size-3);
		}
	}

	h1 {
		display: none;
	}

	@media (--md-n-above) {
		header {
			padding-inline: var(--size-5);
			border-bottom: 1px solid var(--border);
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
	}
</style>
