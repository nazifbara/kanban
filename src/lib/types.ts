import type { SuperValidated } from 'sveltekit-superforms'

import type { taskSchema } from '$lib/zod'

export interface SuperFormContext {
	taskForm: SuperValidated<typeof taskSchema>
}

export interface Container {
	id: string
	name: string
}

export interface Task {
	id: string
	title: string
	description?: string
	status: string
	subtasks: Subtask[]
}

export interface Subtask {
	title: string
	isCompleted: boolean
}
