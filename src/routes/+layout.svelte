<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'

	import '../app.css'
	import { Header, Sidebar } from '$lib/components'
</script>

<div class="layout">
	<Sidebar />

	<div class="content">
		<Header />

		<main>
			<slot />
		</main>
	</div>
</div>

<style lang="postcss">
	@import 'open-props/media';

	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr;
	}

	@media (--md-n-above) {
		.content {
			grid-column: 2 / 2;
		}

		.layout {
			grid-template-columns: auto 1fr;
		}
	}
</style>
