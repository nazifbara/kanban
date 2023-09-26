import { writable } from 'svelte/store'

import type { Board } from './types'
import data from './data.json'

export const boards = (() => {
	const { subscribe, update } = writable<{ selectedBoard: string; boards: Board[] }>({
		selectedBoard: data.boards[0].name,
		boards: data.boards
	})

	return {
		subscribe,
		selectBoard: (board: Board) => update((s) => ({ ...s, selectedBoard: board.name }))
	}
})()
