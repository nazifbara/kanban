<script lang="ts">
	import { writable } from 'svelte/store'
	import { createSwitch, melt } from '@melt-ui/svelte'
	import { Icon } from '$lib/components'
	import { theme } from '$lib/theme'

	const checked = writable($theme === 'dark')

	const {
		elements: { root, input }
	} = createSwitch({ checked })

	$: $checked = $theme === 'dark'
</script>

<div class="theme-switcher-wrapper surface surface--base-1">
	<button use:melt={$root} class="theme-switcher" on:click={() => theme.toggleTheme()}>
		<Icon name="LightTheme" />
		<span>
			<span class="check" />
		</span>
		<Icon name="DarkTheme" />
		<input use:melt={$input} />
	</button>
</div>

<style lang="postcss">
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

		& > span {
			position: relative;
			width: 40px;
			height: 20px;
			border-radius: var(--radius-round);
			background-color: var(--primary-1);
		}

		.check {
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

		&[data-state='checked'] .check {
			left: calc(100% - var(--padding) - var(--size));
		}
	}
</style>
