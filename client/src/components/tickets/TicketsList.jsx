import { useDispatch } from 'react-redux'
import {
	useFetchTicketsQuery,
	useDeleteTicketMutation,
} from '../../store/tickets/ticketApiSlice.js'
import { ticketSelected } from '../../store/tickets/ticketSlice.js'
import { FaTrash, FaCheck, FaPen } from 'react-icons/fa' // Добавим иконку карандаша
import { useState } from 'react'
import TicketEdit from './TicketEdit'

export default function TicketsList({ onEdit }) {
	const dispatch = useDispatch()
	const { data } = useFetchTicketsQuery()
	const [deleteTicket] = useDeleteTicketMutation()
	const [editingTicket, setEditingTicket] = useState(null)

	const handleDelete = (ticketId) => {
		deleteTicket(ticketId)
	}

	// const handleEdit = (ticket) => {
	// 	setEditingTicket(ticket)
	// }

	const handleEditClick = (ticket) => {
		onEdit(ticket)
	}

	if (editingTicket) {
		return (
			<TicketEdit
				ticket={editingTicket}
				onClose={() => setEditingTicket(null)}
			/>
		)
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
								<div className='flex space-x-10 justify-center items-center'>
									<button
										onClick={() => dispatch(ticketSelected(ticket))}
										className='w-7 rounded-full text-green-600 border border-green-600 bg-transparent'
										title='Выбрать задачу'
									>
										<FaCheck className='m-auto' />
									</button>
									<button
										onClick={() => handleEditClick(ticket)}
										className='w-7 rounded-full text-blue-600 border border-blue-600 bg-transparent'
										title='Редактировать задачу'
									>
										<FaPen className='m-auto' />
									</button>
									<button
										onClick={() => handleDelete(ticket._id)}
										className='w-7 rounded-full text-red-600 border border-red-600 bg-transparent'
										title='Удалить задачу'
									>
										<FaTrash className='m-auto' />
									</button>
									{/* <button
										onClick={() => handleEditClick(ticket)}
										className='btn'
									>
										Редактировать
									</button> */}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
