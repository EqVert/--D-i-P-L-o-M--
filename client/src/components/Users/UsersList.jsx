import { useState } from 'react'
import { FaPen, FaCheck, FaTimes } from 'react-icons/fa'
import {
	useGetUsersQuery,
	useUpdateUserMutation,
	useGetAvailableRolesQuery,
} from '../../store/users/userApiSlice.js'

const style = `
	.resizable {
		resize: horizontal;
		overflow: auto;
		min-width: 50px;
	}
`

export default function UsersList() {
	const { data: users, isLoading, error } = useGetUsersQuery()
	const { data: availableRoles } = useGetAvailableRolesQuery()
	const [updateUser] = useUpdateUserMutation()
	const [editingUser, setEditingUser] = useState(null)

	if (isLoading) return <div>Загрузка...</div>
	if (error) return <div>Ошибка: {error.message}</div>

	const handleEdit = (user) => {
		setEditingUser({
			...user,
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			department: user.attributes?.department?.[0] || '',
			middleName: user.attributes?.middleName?.[0] || '',
			position: user.attributes?.position?.[0] || '',
			phone: user.attributes?.phone?.[0] || '',
			computerInventoryNumber:
				user.attributes?.computerInventoryNumber?.[0] || '',
		})
	}

	const handleSave = async (id, data) => {
		try {
			await updateUser({
				id,
				data: {
					username: data.username,
					email: data.email,
					firstName: data.firstName,
					lastName: data.lastName,
					department: data.department,
					middleName: data.middleName,
					position: data.position,
					phone: data.phone,
					computerInventoryNumber: data.computerInventoryNumber,
					roles: data.roles || [],
				},
			}).unwrap()

			setEditingUser(null)
		} catch (error) {
			console.error('Failed to update user:', error)
			// Показать сообщение об ошибке пользователю
			alert('Ошибка при обновлении пользователя: ' + error.message)
		}
	}

	const handleCancel = () => {
		setEditingUser(null)
	}

	// Обработчик изменения ролей
	const handleRoleChange = (role) => {
		const currentRoles = editingUser.roles || []
		const newRoles = currentRoles.includes(role)
			? currentRoles.filter((r) => r !== role)
			: [...currentRoles, role]

		setEditingUser({
			...editingUser,
			roles: newRoles,
		})
	}

	return (
		<div className='p-4'>
			<h2 className='text-2xl mb-4'>Зарегистрированные пользователи</h2>
			<style>{style}</style>
			<table className='min-w-full bg-white dark:bg-slate-800'>
				<thead>
					<tr>
						<th className='py-2 resizable'>Ник</th>
						<th className='py-2 resizable'>Фамилия</th>
						<th className='py-2 resizable'>Имя</th>
						<th className='py-2 resizable'>Отчество</th>
						<th className='py-2 resizable'>Email</th>
						<th className='py-2 resizable'>Отдел</th>
						<th className='py-2 resizable'>Роли</th>
						<th className='py-2 resizable'>Должность</th>
						<th className='py-2 resizable'>Телефон</th>
						<th className='py-2 resizable'>Инвентарный номер компьютера</th>
						<th className='py-2 resizable'>Действия</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => (
						<tr key={user.id} className='border-t'>
							{editingUser?.id === user.id ? (
								<>
									<td className='py-2 px-4'>{user.username}</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.lastName || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													lastName: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите фамилию'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.firstName || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													firstName: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите имя'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.middleName || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													middleName: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите отчество'
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
									<td className='py-2 px-4'>
										<div className='flex flex-col gap-1'>
											{availableRoles?.map((role) => (
												<label
													key={role.name}
													className='flex items-center gap-2'
												>
													<input
														type='checkbox'
														checked={editingUser.roles?.includes(role.name)}
														onChange={() => handleRoleChange(role.name)}
														className='rounded border-gray-300 dark:border-gray-600'
													/>
													<span>{role.name}</span>
												</label>
											))}
										</div>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.position || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													position: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите должность'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.phone || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													phone: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите телефон'
										/>
									</td>
									<td className='py-2 px-4'>
										<input
											type='text'
											value={editingUser.computerInventoryNumber || ''}
											onChange={(e) =>
												setEditingUser({
													...editingUser,
													computerInventoryNumber: e.target.value,
												})
											}
											className='w-full p-1 border rounded dark:bg-slate-700'
											placeholder='Введите инвентарный номер компьютера'
										/>
									</td>
									<td className='py-2 px-4'>
										<div className='flex space-x-2'>
											<button
												onClick={() => handleSave(user.id, editingUser)}
												className='w-7 rounded-full text-green-600 border border-green-600 bg-transparent'
												title='Сохранить изменения'
											>
												<FaCheck className='m-auto' />
											</button>
											<button
												onClick={handleCancel}
												className='w-7 rounded-full text-red-600 border border-red-600 bg-transparent'
												title='Отменить изменения'
											>
												<FaTimes className='m-auto' />
											</button>
										</div>
									</td>
								</>
							) : (
								<>
									<td className='py-2 px-4'>{user.username}</td>
									<td className='py-2 px-4'>{user.lastName || '-'}</td>
									<td className='py-2 px-4'>{user.firstName || '-'}</td>
									<td className='py-2 px-4'>
										{user.attributes?.middleName?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>{user.email}</td>
									<td className='py-2 px-4'>
										{user.attributes?.department?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>{user.roles?.join(', ')}</td>
									<td className='py-2 px-4'>
										{user.attributes?.position?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>
										{user.attributes?.phone?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>
										{user.attributes?.computerInventoryNumber?.[0] || '-'}
									</td>
									<td className='py-2 px-4'>
										<button
											onClick={() => handleEdit(user)}
											className='w-7 rounded-full text-blue-600 border border-blue-600 bg-transparent'
											title='Редактировать пользователя'
										>
											<FaPen className='m-auto' />
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
