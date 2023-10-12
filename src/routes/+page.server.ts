import { superValidate } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'

import { boardSchema, taskSchema } from '$lib/zod'

export const actions = {
	task: async ({ request }) => {
		const form = await superValidate(request, taskSchema)

		if (!form.valid) {
			return fail(400, { form })
		}
		return { form }
	},
	board: async ({ request }) => {
		const form = await superValidate(request, boardSchema)

		if (!form.valid) {
			return fail(400, { form })
		}
		return { form }
	}
}
