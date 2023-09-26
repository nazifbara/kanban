import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'light' | 'dark'

// we set the theme in `app.html` to prevent flashing
const userTheme = browser && localStorage.getItem('color-scheme')

export const theme = (() => {
	const { subscribe, update, set } = writable(userTheme ? userTheme : 'dark')

	function activateTheme(theme: string) {
		window.document.documentElement.setAttribute('color-scheme', theme)
		localStorage.setItem('color-scheme', theme)
		set(theme)
	}

	if (browser) {
		const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
		darkModePreference.addEventListener('change', (e) =>
			e.matches ? activateTheme('dark') : activateTheme('light')
		)
	}

	return {
		subscribe,
		toggleTheme: () =>
			update((currentTheme) => {
				const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

				document.documentElement.setAttribute('color-scheme', newTheme)
				localStorage.setItem('color-scheme', newTheme)

				return newTheme
			}),
		setTheme: (newTheme: Theme) => set(newTheme)
	}
})()
