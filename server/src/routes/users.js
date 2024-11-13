import express from 'express'

// Импортируем keycloak и kcAdminClient из модуля аутентификации
import { keycloak, kcAdminClient } from '../auth/keycloak.js'

const router = express.Router()
// Используем middleware для защиты маршрутов с помощью keycloak
router.use(keycloak.protect())

// Обрабатываем POST-запрос на корневой маршрут
router.post('/', async (req, res) => {
	// Находим роль 'ROLE_USER' в Keycloak
	const role = await kcAdminClient.roles.findOneByName({
		name: 'ROLE_USER',
	})

	// Получаем ID пользователя из токена доступа
	let userId = req.kauth.grant.access_token.content.sub
	// Добавляем пользователю роль 'ROLE_USER'
	await kcAdminClient.users.addRealmRoleMappings({
		id: userId,
		roles: [role],
	})

	// Отправляем ответ с кодом 200
	res.send().status(200)
})

export default router
