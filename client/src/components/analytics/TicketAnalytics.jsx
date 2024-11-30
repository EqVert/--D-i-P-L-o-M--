import { useState } from 'react'
import { useFetchTicketsQuery } from '../../store/tickets/ticketApiSlice'
import TicketBarChart from './TicketBarChart'
import TicketKPICards from './TicketKPICards'
import UserStatistics from './UserStatistics'

export default function TicketAnalytics() {
	const { data: tickets } = useFetchTicketsQuery()
	const [dateRange, setDateRange] = useState('month')
	const [filterType, setFilterType] = useState('status')
	const [timeScale, setTimeScale] = useState('day')

	return (
		<div className='p-3 dark:bg-slate-800'>
			<h2 className='text-xl mb-3 dark:text-slate-200'>Аналітика заявок</h2>
			<div className='mb-3 space-y-5'>
				<TicketKPICards tickets={tickets} />
			</div>

			{/* Добавляем компонент статистики пользователей */}
			<div className='mb-5 p-3 border rounded dark:border-slate-600 dark:bg-slate-700'>
				<UserStatistics tickets={tickets} />
			</div>

			<div className='mb-3 flex gap-2'>
				<select
					value={dateRange}
					onChange={(e) => setDateRange(e.target.value)}
					className='p-1.5 text-sm border rounded dark:bg-slate-700 dark:text-slate-200'
				>
					<option value='week'>За тиждень</option>
					<option value='month'>За місяць</option>
					<option value='year'>За рік</option>
					<option value='all'>За весь час</option>
				</select>

				<select
					value={timeScale}
					onChange={(e) => setTimeScale(e.target.value)}
					className='p-1.5 text-sm border rounded dark:bg-slate-700 dark:text-slate-200'
				>
					<option value='day'>По днях</option>
					<option value='week'>По тижнях</option>
					<option value='month'>По місяцях</option>
					<option value='year'>По роках</option>
				</select>

				<select
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					className='p-1.5 text-sm border rounded dark:bg-slate-700 dark:text-slate-200'
				>
					<option value='status'>За статусом</option>
					<option value='priority'>За пріоритетом</option>
				</select>
			</div>
			<div className='p-3 border rounded dark:border-slate-600 dark:bg-slate-700'>
				<h3 className='text-lg mb-2 dark:text-slate-200'>Динаміка заявок</h3>
				<TicketBarChart
					tickets={tickets}
					dateRange={dateRange}
					timeScale={timeScale}
					filterType={filterType}
				/>
			</div>
		</div>
	)
}
