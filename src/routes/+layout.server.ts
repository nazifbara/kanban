import { superValidate } from 'sveltekit-superforms/server'

import { taskSchema, boardSchema } from '$lib/zod'

export const load = async () => {
	const taskForm = await superValidate(taskSchema)
	const boardForm = await superValidate(boardSchema)
	return { taskForm, boardForm }
}
