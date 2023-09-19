import { writable } from 'svelte/store'

import type { Board } from './types'

export function createBoards(data: Board[]) {
	const { subscribe } = writable<{ selectedBoard: string; boards: Board[] }>({
		selectedBoard: data[0].name,
		boards: data
	})

	return {
		subscribe
	}
}
