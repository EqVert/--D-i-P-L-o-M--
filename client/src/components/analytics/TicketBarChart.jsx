import { useTheme } from '../ThemeSwitcher/ThemeContext'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
	BarElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function TicketBarChart({
	tickets,
	dateRange,
	timeScale,
	filterType,
}) {
	const { theme } = useTheme()

	const formatDate = (date) => {
		const d = new Date(date)

		switch (timeScale) {
			case 'day':
				return d.toLocaleDateString('uk', {
					day: 'numeric',
					month: 'short',
				})
			case 'week':
				const weekNum = Math.ceil(
					(d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) /
						7
				)
				return `Тиждень ${weekNum}, ${d.toLocaleDateString('uk', {
					month: 'short',
				})}`
			case 'month':
				return d.toLocaleDateString('uk', {
					month: 'long',
					year: '2-digit',
				})
			case 'year':
				return d.getFullYear().toString()
			default:
				return d.toLocaleDateString('uk')
		}
	}

	const getStatusColors = () => {
		const colorPalette = [
			{ border: '#dc2626', background: 'rgba(220, 38, 38, 0.3)' }, // красный
			{ border: '#f97316', background: 'rgba(249, 115, 22, 0.3)' }, // оранжевый
			{ border: '#16a34a', background: 'rgba(22, 163, 74, 0.3)' }, // зеленый
			{ border: '#2563eb', background: 'rgba(37, 99, 235, 0.3)' }, // синий
			{ border: '#7c3aed', background: 'rgba(124, 58, 237, 0.3)' }, // фиолетовый
			{ border: '#854d0e', background: 'rgba(133, 77, 14, 0.3)' }, // коричневый
		]

		const colors = {}
		const usedColorIndexes = new Set()
		const uniqueValues = new Set()

		tickets?.forEach((ticket) => {
			uniqueValues.add(ticket.status)
		})

		Array.from(uniqueValues).forEach((value) => {
			// Найти первый неиспользованный цвет
			const availableIndex = colorPalette.findIndex(
				(_, index) => !usedColorIndexes.has(index)
			)
			if (availableIndex !== -1) {
				usedColorIndexes.add(availableIndex)
				colors[value.toLowerCase()] = colorPalette[availableIndex]
			}
		})

		return colors
	}

	const filterTicketsByDate = (tickets) => {
		if (!tickets) return []

		const now = new Date()
		const filtered = tickets.filter((ticket) => {
			const ticketDate = new Date(ticket.createdAt)

			switch (dateRange) {
				case 'week':
					const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
					return ticketDate >= weekAgo
				case 'month':
					const monthAgo = new Date(
						now.getFullYear(),
						now.getMonth() - 1,
						now.getDate()
					)
					return ticketDate >= monthAgo
				case 'year':
					const yearAgo = new Date(
						now.getFullYear() - 1,
						now.getMonth(),
						now.getDate()
					)
					return ticketDate >= yearAgo
				case 'all':
					return true
				default:
					return true
			}
		})

		return filtered
	}

	const getTimelineData = () => {
		const colors = getStatusColors()
		const timeData = {}
		const categories = new Set()

		// Применяем фильтр по дате
		const filteredTickets = filterTicketsByDate(tickets)

		filteredTickets.forEach((ticket) => {
			const date = new Date(ticket.createdAt)
			const dateKey = formatDate(date)
			categories.add(ticket[filterType])

			if (!timeData[dateKey]) {
				timeData[dateKey] = {}
			}

			if (!timeData[dateKey][ticket[filterType]]) {
				timeData[dateKey][ticket[filterType]] = 0
			}

			timeData[dateKey][ticket[filterType]]++
		})

		const sortedDates = Object.keys(timeData).sort(
			(a, b) => new Date(a) - new Date(b)
		)

		return {
			labels: sortedDates,
			datasets: Array.from(categories).map((category) => ({
				label: category,
				data: sortedDates.map((date) => timeData[date][category] || 0),
				backgroundColor: colors[category.toLowerCase()]?.background,
				borderColor: colors[category.toLowerCase()]?.border,
				borderWidth: 1,
			})),
		}
	}

	return (
		<div className='h-[500px]'>
			<Bar
				data={getTimelineData()}
				options={{
					responsive: true,
					maintainAspectRatio: false,
					interaction: {
						mode: 'index',
						intersect: false,
					},
					plugins: {
						legend: {
							position: 'top',
							align: 'start',
							labels: {
								color: theme === 'dark' ? '#e2e8f0' : '#000000',
								usePointStyle: true,
								padding: 15,
								boxWidth: 6,
								font: {
									size: 11,
									weight: 500,
								},
							},
						},
						tooltip: {
							mode: 'index',
							intersect: false,
							backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
							titleColor: theme === 'dark' ? '#e2e8f0' : '#000000',
							bodyColor: theme === 'dark' ? '#e2e8f0' : '#000000',
							borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
							borderWidth: 1,
						},
					},
					scales: {
						x: {
							stacked: true,
							ticks: {
								color: theme === 'dark' ? '#e2e8f0' : '#000000',
								font: { size: 11 },
								maxRotation: 45,
								minRotation: 45,
							},
							grid: {
								display: false,
							},
						},
						y: {
							stacked: true,
							beginAtZero: true,
							ticks: {
								color: theme === 'dark' ? '#e2e8f0' : '#000000',
								font: { size: 11 },
							},
							grid: {
								color: theme === 'dark' ? '#475569' : '#e2e8f0',
							},
						},
					},
				}}
			/>
		</div>
	)
}
