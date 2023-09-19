<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'
	import { setContext } from 'svelte'

	import '../app.css'
	import data from '$lib/data.json'
	import { createBoards } from '$lib/boards'

	const boards = createBoards(data.boards)

	setContext('store', {
		boards
	})
</script>

<div>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		height: 100%;
	}
</style>
