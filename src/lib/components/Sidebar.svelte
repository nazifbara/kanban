<script lang="ts">
	import { Nav, ThemeSwitcher } from '$lib/components'
	import Icon from './Icon.svelte'
</script>

<div class="sidebar surface-2">
	<img src="/assets/logo-light.svg" alt="Logo" class="logo-dark" />
	<img src="/assets/logo-dark.svg" alt="Logo" class="logo-light" />

	<div class="content">
		<div class="nav-wrapper">
			<Nav />
		</div>

		<div class="action">
			<ThemeSwitcher />
			<button class="heading-m"><Icon name="Hide" /> Hide Sidebar</button>
		</div>
	</div>
</div>

<style lang="postcss">
	@import 'open-props/media';

	.sidebar {
		display: none;
		grid-column: 1 / 1;
		grid-row: 1 / 3;
		height: 100%;
		padding-block: var(--size-8);
		border-right: 1px solid var(--border);
	}

	.content {
		display: grid;
	}

	.nav-wrapper {
		padding-inline-end: var(--size-5);
	}

	.action {
		margin-block-start: auto;
	}

	.action button {
		display: flex;
		align-items: center;
		gap: var(--size-3);
		margin-top: var(--size-4);
		padding-block: var(--size-2);
	}

	.action,
	img {
		padding-inline: var(--size-5);
	}

	@media (--OSdark) {
		.logo-light {
			display: none;
		}
	}

	:global([color-scheme='dark']) .logo-light {
		display: none;
	}

	@media (--OSlight) {
		.logo-dark {
			display: none;
		}
	}

	:global([color-scheme='light']) .logo-dark {
		display: none;
	}

	@media (--md-n-above) {
		.sidebar {
			display: grid;
			gap: var(--size-10);
			grid-template-rows: auto 1fr;
		}
	}
</style>
