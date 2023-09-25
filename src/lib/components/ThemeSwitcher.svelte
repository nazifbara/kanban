<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte'
	import { Icon } from '$lib/components'

	const {
		elements: { root, input }
	} = createSwitch()
</script>

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
</style>
