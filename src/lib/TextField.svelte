<script lang="ts">
	export let name = ''
	export let value = ''
	export let placeholder = ''
	export let error = ''
</script>

<div>
	<input class:error class="input surface-2" type="text" {name} {value} {placeholder} />
	{#if error}
		<span>{error}</span>
	{/if}
</div>

<style lang="postcss">
	.error {
		border-color: var(--danger-1);
	}

	div {
		position: relative;

		& span {
			color: var(--danger-1);
			position: absolute;
			top: var(--size-2);
			right: var(--size-3);
		}
	}
</style>
