<script lang="ts">
	export let name = ''
	export let checked = false
</script>

<label class="surface-1 text text--body-m">
	<input type="checkbox" {name} bind:checked />
	<span><slot /></span>
</label>

<style lang="postcss">
	label {
		color: var(--text-1);
		padding: var(--size-3);
		border-radius: var(--radius-2);
		display: flex;
		align-items: center;
		gap: var(--size-3);
		transition: background-color ease-in 150ms;

		&:hover {
			background-color: hsl(var(--primary-1-hsl) / 25%);
		}
	}

	input:checked ~ span {
		text-decoration: line-through;
		color: hsl(var(--text-1-hsl) / 50%);
	}
</style>
