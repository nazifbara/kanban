import type { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'

import type { taskSchema } from '$lib/zod'

export type SelectOption = { label: string; value: string }

export type TaskFormData = z.infer<typeof taskSchema>

export interface SuperFormContext {
	taskForm: SuperValidated<typeof taskSchema>
}

export interface Container {
	id: string
	name: string
}

export interface Task extends TaskFormData {
	id: string
}

export interface Subtask {
	title: string
	isCompleted: boolean
}
