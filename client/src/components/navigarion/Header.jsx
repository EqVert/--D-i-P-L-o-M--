import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentCat } from '../../store/cats/catSlice.js'
import KeycloakUserInfo from './KeycloakUserInfo.jsx'

export default function Header() {
	const cat = useSelector(selectCurrentCat)

	return (
		<header className='flex justify-between w-full bg-slate-800 fixed top-0 left-0 text-lg/8 h-25 mb-5'>
			<nav className='p-5 text-xl'>
				<NavLink to='/cats'>Коти</NavLink>
				{cat && (
					<div>
						Обрано кота: {cat.name} {cat.colour}
					</div>
				)}
			</nav>
			<div className='p-1'>
				<KeycloakUserInfo />
			</div>
		</header>
	)
}
