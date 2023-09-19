<script lang="ts">
	import { iconsMap } from '../icons'

	export let name: keyof typeof iconsMap
</script>

<svelte:component this={iconsMap[name]} />
