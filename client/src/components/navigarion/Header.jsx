import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentCat } from '../../store/cats/catSlice.js'
import { authService } from '../../service/authService.js'
import KeycloakUserInfo from './KeycloakUserInfo.jsx'
import { useAddUserMutation } from '../../store/users/userApiSlice.js'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher.jsx'
import { useState } from 'react'

export default function Header() {
	const [roles, setRoles] = useState(
		authService.getUserInfo('realm_access').roles
	)
	const [addUser] = useAddUserMutation()
	const cat = useSelector(selectCurrentCat)

	async function registerUser() {
		await addUser()
		await authService.tryToRefresh()
		setRoles(authService.getUserInfo('realm_access').roles)
	}

	return (
		<header className='flex justify-between w-full bg-slate-200 dark:bg-slate-800 fixed top-0 left-0 text-lg/6 h-25 p-1'>
			<nav className='m-auto'>
				<NavLink to='/cats' className='mr-10'>
					Коти
				</NavLink>
				<NavLink to='/tickets'>Заявки</NavLink>
				<NavLink
					to='/users'
					className={({ isActive }) =>
						`px-4 py-2 rounded-lg ${
							isActive ? 'bg-slate-100 dark:bg-slate-700' : ''
						}`
					}
				>
					Пользователи
				</NavLink>
				{cat && (
					<div>
						Обрано кота: {cat.name} {cat.colour}
					</div>
				)}
				{roles?.includes('ROLE_USER') ? (
					<div>Привіт {authService.getUserInfo('preferred_username')}</div>
				) : (
					<button onClick={() => registerUser()}>Завершити реєстрацію</button>
				)}
			</nav>
			<div className=''>
				<KeycloakUserInfo />
			</div>
			<ThemeSwitcher className='' />
		</header>
	)
}
