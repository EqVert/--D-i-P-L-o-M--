import { authService } from '../../service/authService.js'

const KeycloakUserInfo = () => {
	return (
		<div>
			<h2>Информация о пользователе</h2>
			<p>Имя: {authService.getUserInfo('name')}</p>
			<button className='p-0 text-base' onClick={() => authService.logout()}>
				Завершить сессию
			</button>
		</div>
	)
}

export default KeycloakUserInfo
