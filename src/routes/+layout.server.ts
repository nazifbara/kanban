import { superValidate } from 'sveltekit-superforms/server'

import { taskSchema } from '$lib/zod'

export const load = async () => {
	const form = await superValidate(taskSchema)
	return { form }
}
