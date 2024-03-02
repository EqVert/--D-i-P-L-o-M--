import React from 'react'
import { useTheme } from './ThemeContext'

const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme()

	const toggleTheme = () => {
		if (theme === 'light') {
			setTheme('dark')
		} else {
			setTheme('light')
		}
	}

	const getIcon = () => {
		if (theme === 'light') {
			return '🌞' // Иконка для светлой темы
		} else {
			return '🌜' // Иконка для тёмной темы
		}
	}

	return (
		<button
			onClick={toggleTheme}
			className='w-14 content-center p-2 bg-slate-400 rounded-md'
		>
			{getIcon()}
		</button>
	)
}

export default ThemeSwitcher
