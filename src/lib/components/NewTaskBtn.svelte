<script lang="ts">
	import { writable } from 'svelte/store'

	import { Icon, TaskForm } from '$lib/components'

	let isOpen = writable(false)

	const open = () => ($isOpen = true)
</script>

<button on:click={open} class="new-task btn btn--primary btn--large"> + Add New Task </button>

<button on:click={open} class="new-task btn btn--primary btn--large" aria-label="Add New Task">
	<Icon name="AddTaskMobile" />
</button>

<TaskForm {isOpen} />

<style lang="postcss">
	@import 'open-props/media';

	.new-task:not([aria-label]) {
		display: none;
	}

	@media (--md-n-above) {
		.new-task[aria-label] {
			display: none;
		}

		.new-task:not([aria-label]) {
			display: initial;
		}
	}
</style>
