<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { scale } from 'svelte/transition'
	import type { Writable } from 'svelte/store'
	import { createDialog, melt } from '@melt-ui/svelte'

	export let isOpen: Writable<boolean> | undefined = undefined

	const dispatch = createEventDispatcher()

	const {
		elements: { portalled, overlay, content, title, description },
		states: { open }
	} = createDialog({ open: isOpen, role: 'alertdialog' })
</script>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="overlay z-2" />

		<article transition:scale use:melt={$content} class="task-modal-shell z-4">
			<header>
				<h3 use:melt={$title} class="heading-l">
					<slot name="title" />
				</h3>
			</header>

			<p use:melt={$description}>
				<slot />
			</p>

			<div class="actions">
				<button
					on:click={() => {
						dispatch('confirm')
						$isOpen = false
					}}
					class="btn danger">Delete</button
				>
				<button on:click={() => ($isOpen = false)} class="btn secondary">Cancel</button>
			</div>
		</article>
	{/if}
</div>

<style lang="postcss">
	h3 {
		color: var(--danger-1);
	}

	p {
		color: var(--text-2);
	}

	.actions {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--size-3);
	}
</style>
