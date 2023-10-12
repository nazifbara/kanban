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

export const boardSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	columns: z.array(z.object({ id: z.string().min(1), name: z.string().min(1) })).default([])
})
