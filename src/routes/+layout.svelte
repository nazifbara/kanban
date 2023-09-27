<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'

	import '../app.css'
	import { Header, Sidebar } from '$lib/components'

	let sidebarIsVisible = true

	$: console.log(sidebarIsVisible)
</script>

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
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
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
