import type { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'
import type { Writable } from 'svelte/store'

import type { taskSchema, boardSchema } from '$lib/zod'

export type SelectOption = { label: string; value: string }

export type TaskFormData = z.infer<typeof taskSchema>
export type BoardFormData = z.infer<typeof boardSchema>

export type EditBoardContext = { editingBoard: Writable<boolean>; open: () => void }
export interface SuperFormContext {
	taskForm: SuperValidated<typeof taskSchema>
	boardForm: SuperValidated<typeof boardSchema>
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
