import { z } from 'zod'

export const taskSchema = z.object({
	title: z.string().min(1),
	description: z.string().default('').optional(),
	subtasks: z
		.array(z.object({ title: z.string().min(1), isCompleted: z.boolean().default(false) }))
		.default([]),
	status: z.object({
		label: z.string().min(1),
		value: z.string().min(1)
	})
})
