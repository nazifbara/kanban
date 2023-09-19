<script lang="ts">
	import { SubtaskCheckbox, TextField, Dropdown } from '$lib'
</script>

<div class="surface-2">
	<SubtaskCheckbox>Lorem ipsum dolor sit amet</SubtaskCheckbox>
	<TextField placeholder="Enter task name" />
	<Dropdown buttonLabel="Select a column" options={['Todo', 'Doing', 'Done']} />
</div>

<style>
	div {
		display: grid;
		gap: 20px;
		justify-items: center;
		padding-block: 30px;
	}
</style>
