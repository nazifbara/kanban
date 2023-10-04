import { superValidate } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'

import { taskSchema } from '$lib/zod'

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, taskSchema)

		if (!form.valid) {
			return fail(400, { form })
		}
		return { form }
	}
}
