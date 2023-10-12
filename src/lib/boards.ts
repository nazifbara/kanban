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
		currentBoardIndex: number
		items: Container[]
	}>({
		currentBoardIndex: 0,
		items: initialBoards
	})

	return {
		subscribe,
		selectBoard: (index: number) => update((s) => ({ ...s, currentBoardIndex: index })),
		editBoard: (data: Container) =>
			update((s) => {
				const boardIndex = s.items.findIndex((t) => t.id === data.id)
				const items = [
					...s.items.slice(0, boardIndex),
					{ ...data },
					...s.items.slice(boardIndex + 1)
				]
				return { ...s, items }
			})
	}
})()

export const columns = (() => {
	const { subscribe, update } = writable<Record<string, Container[]>>(initialColumns)
	return {
		subscribe,
		deletColumn: (column: Container, board: Container) =>
			update((v) => ({ ...v, [board.id]: v[board.id].filter((c) => c.id !== column.id) })),
		saveColumns: (board: Container, columns: Container[]) =>
			update((v) => ({ ...v, [board.id]: columns }))
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
		deleteColumn: (column: Container) =>
			update((v) => {
				delete v[column.id]
				return v
			}),
		addTask: (data: TaskFormData) =>
			updateTasks(data.status.value, (oldTasks) => [{ id: uid(), ...data }, ...oldTasks]),
		editTask: (taskId: string, data: TaskFormData | Task) =>
			updateTasks(data.status.value, (oldTasks) => {
				const taskIndex = oldTasks.findIndex((t) => t.id === taskId)
				const newTasks = [
					...oldTasks.slice(0, taskIndex),
					{ id: taskId, ...data },
					...oldTasks.slice(taskIndex + 1)
				]
				return newTasks
			}),
		deleteTask: (task: Task) =>
			updateTasks(task.status.value, (oldTasks) => oldTasks.filter((t) => t.id !== task.id))
	}
})()
