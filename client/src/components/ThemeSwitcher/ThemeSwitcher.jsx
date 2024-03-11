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
		<button onClick={toggleTheme} className='w-10 ml-1'>
			{getIcon()}
		</button>
	)
}

export default ThemeSwitcher
