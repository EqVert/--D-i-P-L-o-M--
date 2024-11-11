import { useDispatch } from 'react-redux'
import {
	useFetchTicketsQuery,
	useDeleteTicketMutation,
} from '../../store/tickets/ticketApiSlice.js'
import { ticketSelected } from '../../store/tickets/ticketSlice.js'
import { FaTrash, FaCheck } from 'react-icons/fa'

export default function TicketsList() {
	const dispatch = useDispatch()
	const { data } = useFetchTicketsQuery()
	const [deleteTicket] = useDeleteTicketMutation()

	const handleDelete = (ticketId) => {
		deleteTicket(ticketId)
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}.${month}.${day}`
	}

	const isPastDeadline = (deadline) => {
		const currentDate = new Date()
		const deadlineDate = new Date(deadline)
		return deadlineDate < currentDate
	}

	const isPastDeadlineAndOpen = (deadline, status) => {
		const currentDate = new Date()
		const deadlineDate = new Date(deadline)
		return deadlineDate < currentDate && status.toLowerCase() === 'открыта'
	}

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full bg-white'>
				<thead>
					<tr>
						<th className='border'>ID</th>
						<th className='border'>Название</th>
						<th className='border'>Описание</th>
						<th className='border'>Статус</th>
						<th className='border'>Приоритет</th>
						<th className='border'>Крайний срок</th>
						<th className='border'>Час</th>
						<th className='border'>Дата начала</th>
						<th className='border'>Комментарий</th>
						<th className='border'>Действия</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((ticket) => (
						<tr key={ticket._id}>
							<td className='border'>{ticket.number}</td>
							<td className='border'>{ticket.title}</td>
							<td className='border'>{ticket.description}</td>
							<td className='border'>{ticket.status}</td>
							<td className='border'>{ticket.priority}</td>
							<td
								className={`border ${
									isPastDeadlineAndOpen(ticket.deadline, ticket.status)
										? 'bg-red-800'
										: ''
								}`}
							>
								{formatDate(ticket.deadline)}
							</td>
							<td className='border'>{ticket.plannedEffort}</td>
							<td className='border'>{formatDate(ticket.startDate)}</td>
							<td className='border'>{ticket.comment}</td>
							<td className='border'>
								<div className='flex space-x-2'>
									<button
										onClick={() => dispatch(ticketSelected(ticket))}
										className='btn m-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
										title='Выбрать задачу'
									>
										<FaCheck />
									</button>
									<button
										onClick={() => handleDelete(ticket._id)}
										className='btn m-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
										title='Удалить задачу'
									>
										<FaTrash />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
