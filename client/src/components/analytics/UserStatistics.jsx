import { useTheme } from '../ThemeSwitcher/ThemeContext'

export default function UserStatistics({ tickets }) {
	const { theme } = useTheme()

	if (!tickets || tickets.length === 0) {
		return null
	}

	// Группируем заявки по пользователям
	const userStats = tickets.reduce((acc, ticket) => {
		if (ticket.acceptedBy) {
			if (!acc[ticket.acceptedBy]) {
				acc[ticket.acceptedBy] = {
					total: 0,
					inProgress: 0,
					completed: 0,
					overdue: 0,
				}
			}

			acc[ticket.acceptedBy].total++

			if (
				ticket.status === 'В роботі' ||
				ticket.status === 'Очікує відповіді'
			) {
				acc[ticket.acceptedBy].inProgress++
			}
			if (ticket.status === 'Виконано') {
				acc[ticket.acceptedBy].completed++
			}
			if (
				ticket.deadline &&
				new Date(ticket.deadline).getTime() < new Date().getTime() &&
				ticket.status !== 'Виконано' &&
				ticket.status !== 'Відхилено'
			) {
				acc[ticket.acceptedBy].overdue++
			}
		}
		return acc
	}, {})

	return (
		<div className='overflow-x-auto'>
			<h3 className='text-lg mb-2 dark:text-slate-200'>
				Статистика по користувачам
			</h3>
			<table className='min-w-full'>
				<thead>
					<tr>
						<th className='text-left p-2'>Користувач</th>
						<th className='p-2'>Всього заявок</th>
						<th className='p-2'>В роботі</th>
						<th className='p-2'>Виконано</th>
						<th className='p-2'>Прострочено</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(userStats).map(([user, stats]) => (
						<tr key={user}>
							<td className='p-2'>{user}</td>
							<td className='text-center p-2'>{stats.total}</td>
							<td className='text-center p-2'>{stats.inProgress}</td>
							<td className='text-center p-2'>{stats.completed}</td>
							<td className='text-center p-2 text-red-600 dark:text-red-400'>
								{stats.overdue}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
