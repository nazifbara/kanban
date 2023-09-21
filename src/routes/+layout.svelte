<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'

	import '../app.css'
	import { Header } from '$lib/components'
</script>

<div class="layout">
	<Header />

	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr;
	}
</style>
