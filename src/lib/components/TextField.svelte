<script lang="ts">
	export let name = ''
	export let value = ''
	export let placeholder = ''
	export let error = ''
</script>

<div>
	<input
		{...$$restProps}
		class:error
		class="input surface surface--base-2"
		type="text"
		{name}
		bind:value
		{placeholder}
	/>
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
