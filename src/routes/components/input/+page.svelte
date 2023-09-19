<script lang="ts">
	import { SubtaskCheckbox, TextField, Dropdown } from '$lib'
</script>

<div class="surface-2">
	<SubtaskCheckbox>Lorem ipsum dolor sit amet</SubtaskCheckbox>
	<TextField placeholder="Enter task name" />
	<TextField placeholder="Enter task name" error="Can't be empty" />
	<Dropdown buttonLabel="Select a column" options={['Todo', 'Doing', 'Done']} />
</div>

<style>
	div {
		display: grid;
		gap: 20px;
		width: min(100%, 700px);
		margin-inline: auto;
		padding: 30px;
	}
</style>
