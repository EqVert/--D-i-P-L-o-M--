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

// Получение списка пользователей
router.get('/', async (req, res) => {
	try {
		const users = await kcAdminClient.users.find()

		// Отфильтровываем и форматируем данные пользователей
		const formattedUsers = await Promise.all(
			users.map(async (user) => {
				// Получаем роли пользователя
				const userRoles = await kcAdminClient.users.listRealmRoleMappings({
					id: user.id,
				})

				return {
					id: user.id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					attributes: user.attributes,
					roles: userRoles.map((role) => role.name),
				}
			})
		)

		res.json(formattedUsers)
	} catch (error) {
		console.error('Ошибка при получении пользователей:', error)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
})

// server/src/routes/users.js
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const userData = req.body

		if (!id || !userData) {
			return res.status(400).json({ message: 'Missing required data' })
		}

		console.log('Updating user:', { id, userData }) // Для отладки

		// Проверяем существование пользователя
		const existingUser = await kcAdminClient.users.findOne({ id })
		if (!existingUser) {
			return res.status(404).json({ message: 'User not found' })
		}

		// Обновляем данные пользователя, используя встроенные поля firstName и lastName
		await kcAdminClient.users.update(
			{ id },
			{
				firstName: userData.firstName,
				lastName: userData.lastName,
				username: userData.username,
				email: userData.email,
				emailVerified: true,
				enabled: true,
				attributes: {
					department: [userData.department],
					middleName: [userData.middleName],
					position: [userData.position],
					phone: [userData.phone],
					computerInventoryNumber: [userData.computerInventoryNumber],
				},
			}
		)

		// Получаем обновленные данные
		const updatedUser = await kcAdminClient.users.findOne({ id })
		const userRoles = await kcAdminClient.users.listRealmRoleMappings({ id })

		const formattedUser = {
			id: updatedUser.id,
			username: updatedUser.username,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			email: updatedUser.email,
			attributes: updatedUser.attributes,
			roles: userRoles.map((role) => role.name),
		}

		res.json(formattedUser)
	} catch (error) {
		console.error('Error updating user:', error)
		res.status(500).json({
			message: 'Server error',
			error: error.message,
		})
	}
})

export default router
