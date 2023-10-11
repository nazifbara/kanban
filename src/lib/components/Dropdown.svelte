<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { createSelect, melt } from '@melt-ui/svelte'

	import { Icon } from './'
	import type { SelectOption } from '$lib/types'

	export let name = ''
	export let options: SelectOption[]
	export let buttonLabel: string | null = null
	export let selected: SelectOption | null = null

	const dispatch = createEventDispatcher<{ change: SelectOption }>()

	const {
		elements: { trigger, menu, option, input },
		states: { selectedLabel, open }
	} = createSelect({
		defaultSelected: buttonLabel
			? undefined
			: { value: selected?.value ?? options[0].value, label: selected?.label ?? options[0].label },
		forceVisible: true,
		name,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		},
		onSelectedChange: ({ next }) => {
			selected = { value: next?.value ?? '', label: next?.label ?? '' }
			dispatch('change', selected)
			return next
		}
	})
</script>

<input use:melt={$input} value={$input.value?.value} />
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
			<li use:melt={$option(op)}>{op.label}</li>
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
