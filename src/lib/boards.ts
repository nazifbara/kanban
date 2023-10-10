import { writable } from 'svelte/store'
import { v4 as uid } from 'uuid'

import type { Container, Task, TaskFormData } from './types'
import data from './data.json'

function getInitialValues() {
	const initialBoards: Container[] = []
	const initialColumns: Record<string, Container[]> = {}
	const initialTasks: Record<string, Task[]> = {}

	data.boards.forEach((board) => {
		const boardId = uid()
		initialBoards.push({ id: boardId, name: board.name })

		initialColumns[boardId] = board.columns.map((column) => {
			const columnId = uid()
			initialTasks[columnId] = column.tasks.map((task) => ({
				...task,
				id: uid(),
				status: { label: task.status, value: columnId }
			}))
			return { id: columnId, name: column.name }
		})
	})

	return { initialBoards, initialColumns, initialTasks }
}

const { initialBoards, initialColumns, initialTasks } = getInitialValues()

export const boards = (() => {
	const { subscribe, update } = writable<{
		currentBoard: Container
		items: Container[]
	}>({
		currentBoard: initialBoards[0],
		items: initialBoards
	})

	return {
		subscribe,
		selectBoard: (board: Container) => update((s) => ({ ...s, currentBoard: board }))
	}
})()

export const columns = (() => {
	const { subscribe } = writable<Record<string, Container[]>>(initialColumns)
	return {
		subscribe
	}
})()

export const tasks = (() => {
	const { subscribe, update } = writable<Record<string, Task[]>>(initialTasks)

	const updateTasks = (columnId: string, updater: (oldTasks: Task[]) => Task[]) => {
		update((s) => {
			const tasks = s[columnId]
			return {
				...s,
				[columnId]: updater(tasks)
			}
		})
	}

	return {
		subscribe,
		addTask: (data: TaskFormData) =>
			updateTasks(data.status.value, (oldTasks) => [...oldTasks, { id: uid(), ...data }]),
		editTask: (id: string, data: TaskFormData) =>
			updateTasks(data.status.value, (oldTasks) => {
				const taskIndex = oldTasks.findIndex((t) => t.id === id)
				const newTasks = [
					...oldTasks.slice(0, taskIndex),
					{ id, ...data },
					...oldTasks.slice(taskIndex + 1)
				]
				return newTasks
			}),
		deleteTask: (id: string, columnId: string) =>
			updateTasks(columnId, (oldTasks) => oldTasks.filter((t) => t.id !== id))
	}
})()
