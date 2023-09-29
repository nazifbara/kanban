<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte'

	import { Icon } from './'

	export let name = ''
	export let options: string[]
	export let buttonLabel: string | null = null

	const {
		elements: { trigger, menu, option },
		states: { selectedLabel, open }
	} = createSelect({
		defaultSelected: buttonLabel ? undefined : { value: options[0], label: options[0] },
		forceVisible: true,
		name,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	})
</script>

<button
	style:border-color={$open ? 'var(--primary-1)' : 'hsl(var(--text-2-hsl) / 25%)'}
	class="input"
	use:melt={$trigger}
>
	<span>{$selectedLabel || buttonLabel}</span>
	<Icon name="ChevronDown" />
</button>

{#if $open}
	<ul use:melt={$menu} class="surface-1">
		{#each options as op}
			<li use:melt={$option({ value: op, label: op })}>{op}</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	button {
		display: flex;
		gap: var(--size-2);
		justify-content: space-between;
		align-items: center;
	}

	ul {
		padding: var(--size-3);
		border-radius: var(--radius-2);
		box-shadow: 0 10px 20px hsl(0 0% 0% / 25%);

		& li:not(:last-child) {
			padding-block-end: var(--size-2);
		}
	}
</style>
