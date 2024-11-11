import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentCat } from '../../store/cats/catSlice.js'
import KeycloakUserInfo from './KeycloakUserInfo.jsx'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher.jsx'

export default function Header() {
	const cat = useSelector(selectCurrentCat)

	return (
		<header className='flex justify-between w-full bg-slate-200 dark:bg-slate-800 fixed top-0 left-0 text-lg/6 h-25 p-1'>
			<nav className='m-auto'>
				<NavLink to='/cats' className='mr-10'>
					Коти
				</NavLink>
				<NavLink to='/tikets'>Заявки</NavLink>
				{cat && (
					<div>
						Обрано кота: {cat.name} {cat.colour}
					</div>
				)}
			</nav>
			<div className=''>
				<KeycloakUserInfo />
			</div>
			<ThemeSwitcher className='' />
		</header>
	)
}
