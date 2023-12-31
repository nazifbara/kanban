<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import { Nav, ThemeSwitcher } from '$lib/components'
	import Icon from './Icon.svelte'

	const dispatch = createEventDispatcher()

	function onVisibilityChange(value: boolean) {
		hide = value
		dispatch('visibility-change', {
			visible: !hide
		})
	}

	let hide = false
</script>

{#if !hide}
	<div class="sidebar surface surface--base-2">
		<img src="/assets/logo-light.svg" alt="Logo" class="logo-dark" />
		<img src="/assets/logo-dark.svg" alt="Logo" class="logo-light" />

		<div class="content">
			<div class="nav-wrapper">
				<Nav />
			</div>

			<div class="action">
				<ThemeSwitcher />
				<button on:click={() => onVisibilityChange(true)}><Icon name="Hide" /> Hide Sidebar</button>
			</div>
		</div>
	</div>
{:else}
	<button aria-label="Show sidebar" class="show-button" on:click={() => onVisibilityChange(false)}>
		<Icon name="Show" />
	</button>
{/if}

<style lang="postcss">
	@import 'open-props/media';

	.sidebar {
		display: none;
		grid-column: 1 / 1;
		grid-row: 1 / 3;
		height: 100%;
		overflow-y: scroll;
		padding-block: var(--size-8);
		border-right: 1px solid var(--border);
		width: var(--sidebar-width);
	}

	.show-button {
		display: none;
		place-content: center;
		position: fixed;
		bottom: var(--size-8);
		background-color: var(--primary-1);
		width: 56px;
		height: 48px;
		border-end-end-radius: var(--radius-round);
		border-start-end-radius: var(--radius-round);
	}

	.content {
		display: grid;
		justify-content: space-between;
	}

	.nav-wrapper {
		padding-inline-end: var(--size-5);
		overflow-y: scroll;
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

	@media (--OSlight) {
		.logo-dark {
			display: none;
		}
	}

	:global([color-scheme='dark']) .logo-light {
		display: none;
	}

	:global([color-scheme='dark']) .logo-dark {
		display: block;
	}

	:global([color-scheme='light']) .logo-dark {
		display: none;
	}

	:global([color-scheme='light']) .logo-light {
		display: block;
	}

	@media (--md-n-above) {
		.sidebar {
			display: grid;
			gap: var(--size-10);
			grid-template-rows: auto 1fr;
		}

		.show-button {
			display: grid;
		}

		.show-button:hover {
			background-color: var(--primary-2);
			transition: background-color 300ms var(--ease-5);
		}
	}
</style>
