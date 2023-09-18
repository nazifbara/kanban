<script lang="ts">
	import 'open-props/style'
	import 'open-props/normalize'

	import '../app.css'
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
