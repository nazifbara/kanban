import { writable } from 'svelte/store'

import type { Board } from './types'
import data from './data.json'

export const boards = (function createBoards() {
	const { subscribe } = writable<{ selectedBoard: string; boards: Board[] }>({
		selectedBoard: data.boards[0].name,
		boards: data.boards
	})

	return {
		subscribe
	}
})()
