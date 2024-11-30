import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentCat } from '../../store/cats/catSlice.js'
import { authService } from '../../service/authService.js'
import KeycloakUserInfo from './KeycloakUserInfo.jsx'
import { useAddUserMutation } from '../../store/users/userApiSlice.js'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher.jsx'
import { useState } from 'react'

export default function Header() {
	const roles = authService.getUserInfo('realm_access')?.roles || []
	const canViewTickets =
		roles.includes('ROLE_USER') || roles.includes('ROLE_ADMIN_TICKET')

	return (
		<header className='flex justify-between w-full bg-slate-200 dark:bg-slate-800 fixed top-0 left-0 text-xl h-25 p-1'>
			<nav className='m-auto'>
				<NavLink
					to='/cats'
					className={({ isActive }) =>
						`mr-10 ${
							isActive
								? 'underline decoration-blue-500 decoration-4 underline-offset-4'
								: ''
						}`
					}
				>
					Коти
				</NavLink>
				{canViewTickets && (
					<NavLink
						to='/tickets'
						className={({ isActive }) =>
							`mr-10 ${
								isActive
									? 'underline decoration-blue-500 decoration-4 underline-offset-4'
									: ''
							}`
						}
					>
						Заявки
					</NavLink>
				)}
				{roles.includes('ROLE_ADMIN_USER') && (
					<NavLink
						to='/users'
						className={({ isActive }) =>
							`mr-10 ${
								isActive
									? 'underline decoration-blue-500 decoration-4 underline-offset-4'
									: ''
							}`
						}
					>
						Користувачі
					</NavLink>
				)}
				<NavLink
					to='/analytics'
					className={({ isActive }) =>
						`mr-10 ${
							isActive
								? 'underline decoration-blue-500 decoration-4 underline-offset-4'
								: ''
						}`
					}
				>
					Аналітика
				</NavLink>
			</nav>
			<div className=''>
				<KeycloakUserInfo />
			</div>
			<ThemeSwitcher className='' />
		</header>
	)
}
