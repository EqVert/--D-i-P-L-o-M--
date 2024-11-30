import { useTheme } from '../ThemeSwitcher/ThemeContext'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function TicketKPICards({ tickets }) {
	const { theme } = useTheme()

	if (!tickets || tickets.length === 0) {
		return null
	}

	// Расчет KPI
	const currentDate = new Date()
	const stats = tickets.reduce(
		(acc, ticket) => {
			// Общее количество заявок
			acc.total++

			// Статусы
			if (ticket.status === 'Відкрита') acc.open++
			if (ticket.status === 'В роботі') acc.inProgress++
			if (ticket.status === 'Виконано') acc.completed++

			// Просроченные заявки
			const deadline = new Date(ticket.deadline)
			if (deadline < currentDate && ticket.status !== 'Виконано') {
				acc.overdue++
			}

			// Среднее время выполнения (для завершенных)
			if (ticket.status === 'Виконано') {
				const created = new Date(ticket.createdAt)
				const completed = new Date(ticket.updatedAt)
				acc.totalResolutionTime += completed - created
				acc.completedCount++
			}

			return acc
		},
		{
			total: 0,
			open: 0,
			inProgress: 0,
			completed: 0,
			overdue: 0,
			totalResolutionTime: 0,
			completedCount: 0,
		}
	)

	// Среднее время выполнения в днях
	const avgResolutionDays = stats.completedCount
		? Math.round(
				stats.totalResolutionTime / (stats.completedCount * 24 * 60 * 60 * 1000)
		  )
		: 0

	const cards = [
		{
			title: 'Всього заявок',
			value: stats.total,
			color: 'bg-blue-100 dark:bg-blue-900',
		},
		{
			title: 'Відкритих',
			value: stats.open,
			color: 'bg-yellow-100 dark:bg-yellow-900',
		},
		{
			title: 'В роботі',
			value: stats.inProgress,
			color: 'bg-purple-100 dark:bg-purple-900',
		},
		{
			title: 'Виконано',
			value: stats.completed,
			color: 'bg-green-100 dark:bg-green-900',
		},
		{
			title: 'Прострочено',
			value: stats.overdue,
			color: 'bg-red-100 dark:bg-red-900',
		},
		{
			title: 'Середній час виконання',
			value: `${avgResolutionDays} днів`,
			color: 'bg-gray-100 dark:bg-gray-900',
		},
	]

	return (
		<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
			{cards.map((card, index) => (
				<div key={index} className={`${card.color} p-4 rounded-lg shadow-sm`}>
					<h3 className='text-sm font-medium dark:text-slate-200'>
						{card.title}
					</h3>
					<p className='text-2xl font-bold mt-2 dark:text-slate-200'>
						{card.value}
					</p>
				</div>
			))}
		</div>
	)
}
