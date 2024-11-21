import { authService } from '../../service/authService.js'

const KeycloakUserInfo = () => {
	return (
		<div>
			<h2>Привіт,</h2>
			<p>{authService.getUserInfo('name')}</p>
			<button className='p-0 text-base' onClick={() => authService.logout()}>
				Завершити сессію
			</button>
		</div>
	)
}

export default KeycloakUserInfo
