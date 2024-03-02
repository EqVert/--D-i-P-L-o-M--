import { Outlet } from 'react-router-dom'
import { authService } from './service/authService.js'
import Header from './components/navigarion/Header.jsx'

export default function App() {
	const isLoggedIn = authService.isLoggedIn()

	if (!isLoggedIn) {
		return <div>Loading...</div>
	}

	return (
		<>
			<Header />
			<div className='pt-28'>
				<Outlet />
			</div>
		</>
	)
}
