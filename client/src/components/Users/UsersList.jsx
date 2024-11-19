import { useState } from 'react'
import {
	useGetUsersQuery,
	useUpdateUserMutation,
} from '../../store/users/userApiSlice.js'

export default function UsersList() {
	const { data: users, isLoading, error } = useGetUsersQuery()
	const [updateUser] = useUpdateUserMutation()
	const [editingUser, setEditingUser] = useState(null)

	if (isLoading) return <div>Загрузка...</div>
	if (error) return <div>Ошибка: {error.message}</div>

	const handleEdit = (user) => {
		setEditingUser({
			...user,
			department: user.attributes?.department?.[0] || '', // Добавляем отдел из атрибутов
		})
	}

	const handleSave = async (id, data) => {
		try {
			// Проверяем данные перед отправкой
			if (!data.username || !data.email) {
				console.error('Missing required fields')
				return
			}

			const result = await updateUser({
				id,
				data: {
					username: data.username,
					email: data.email,
					department: data.department, // Добавляем отдел в отправляемые данные
				},
			}).unwrap()

			console.log('User updated successfully:', result)
			setEditingUser(null)
		} catch (error) {
			console.error('Failed to update user:', error)
			// Добавить уведомление пользователю об ошибке
		}
	}

	const handleCancel = () => {
		setEditingUser(null)
	}

	return (
		<div className='p-4'>
			<h2 className='text-2xl mb-4'>Зарегистрированные пользователи</h2>
			<table className='min-w-full bg-white dark:bg-slate-800'>
				<thead>
					<tr>
						<th className='py-2'>Имя пользователя</th>
						<th className='py-2'>Email</th>
						<th className='py-2'>Отдел</th>
						<th className='py-2'>Роли</th>
						<th className='py-2'>Действия</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => (
						<tr key={user.id} className='border-t'>
							{editingUser?.id === user.id ? (
								<>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.username}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													username: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='email'
											value={editingUser.email}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													email: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.department || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													department: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите отдел'
										/>
									</td>
									<td className='py-2 px-4'>{user.roles?.join(', ')}</td>
									<td className='py-2 px-4'>
										<button
											onClick={() => handleSave(user.id, editingUser)}
											className='px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600'
										>
											Сохранить
										</button>
										<button
											onClick={handleCancel}
											className='px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600'
										>
											Отмена
										</button>
									</td>
								</>
							) : (
								<>
									<td className='py-2 px-4'>{user.username}</td>
									<td className='py-2 px-4'>{user.email}</td>
									<td className='py-2 px-4'>
										{user.attributes?.department?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>{user.roles?.join(', ')}</td>
									<td className='py-2 px-4'>
										<button
											onClick={() => handleEdit(user)}
											className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
										>
											Редактировать
										</button>
									</td>
								</>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
