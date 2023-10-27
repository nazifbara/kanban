<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { createToaster, melt } from '@melt-ui/svelte'
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'

	import '../app.css'

	import type { PageData } from './$types'
	import { Header, Sidebar } from '$lib/components'
	import type { SuperFormContext, EditBoardContext } from '$lib/types'
	import { saveBoards } from '$lib/boards'

	export let data: PageData

	const {
		elements: { content, description },
		helpers: { addToast },
		states: { toasts },
		actions: { portal }
	} = createToaster<string>()

	function showToast(message: string) {
		addToast({ data: message })
	}

	setContext('toast', {
		showToast
	})

	let editingBoard = writable(false)
	console.log($saveBoards)

	setContext<SuperFormContext>('superForm', {
		taskForm: data.taskForm,
		boardForm: data.boardForm
	})

	setContext<EditBoardContext>('editBoardOpen', {
		editingBoard,
		open: () => ($editingBoard = true)
	})

	let sidebarIsVisible = true
</script>

<div class="toast-portal" use:portal>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, y: 80 }}
			out:fly={{ duration: 150, y: 80 }}
			class="toast"
		>
			<div use:melt={$description(id)}>
				{data}
			</div>
		</div>
	{/each}
</div>

<div class="layout">
	<Sidebar on:visibility-change={(e) => (sidebarIsVisible = e.detail.visible)} />

	<div class="content">
		<Header />

		<main class:with-sidebar={sidebarIsVisible}>
			<slot />
		</main>
	</div>
</div>

<style lang="postcss">
	@import 'open-props/media';

	main {
		height: calc(100dvh - var(--header-height));
		width: calc(100dvw);
		padding-block: var(--size-5);
		padding-inline: var(--size-3);
		overflow: scroll;
	}

	.layout {
		height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
	}

	.toast-portal {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--size-3);
		position: fixed;
		z-index: 50;
		right: 50%;
		margin-block: auto;
		bottom: var(--size-5);
		transform: translateX(50%);
	}

	.toast {
		border-radius: var(--radius-3);
		background-color: #129c63;
		color: white;
		position: relative;
		max-width: calc(100vw - 2rem);
		padding: var(--size-3);
	}

	@media (--md-n-above) {
		main {
			padding-inline: var(--size-5);

			&.with-sidebar {
				width: calc(100dvw - var(--sidebar-width));
			}
		}
		.content {
			grid-column: 2 / 2;
		}

		.layout {
			grid-template-columns: auto 1fr;
		}
	}
</style>
