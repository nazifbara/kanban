import type { SuperValidated } from 'sveltekit-superforms'

import type { taskSchema } from '$lib/zod'

export interface SuperFormContext {
	taskForm: SuperValidated<typeof taskSchema>
}

export interface Board {
	name: string
	columns: Column[]
}

export interface Column {
	name: string
	tasks: Task[]
}

export interface Task {
	title: string
	description?: string
	status: string
	subtasks: Subtask[]
}

export interface Subtask {
	title: string
	isCompleted: boolean
}
