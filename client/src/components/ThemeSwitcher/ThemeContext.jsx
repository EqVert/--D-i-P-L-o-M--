import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		const storedTheme = localStorage.getItem('theme')
		if (storedTheme) {
			return storedTheme
		}
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches
		return prefersDark ? 'dark' : 'light'
	})

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => useContext(ThemeContext)
