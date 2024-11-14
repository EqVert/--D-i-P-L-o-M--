import { useState } from 'react'
import { useUpdateTicketMutation } from '../../store/tickets/ticketApiSlice'

export default function TicketEdit({ ticket, onClose }) {
	const [formData, setFormData] = useState({
		title: ticket.title,
		description: ticket.description,
		status: ticket.status,
		priority: ticket.priority,
		deadline: ticket.deadline.split('T')[0],
		plannedEffort: ticket.plannedEffort,
		startDate: ticket.startDate.split('T')[0],
		comment: ticket.comment,
	})

	const [updateTicket] = useUpdateTicketMutation()

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await updateTicket({
				id: ticket._id,
				ticket: formData,
			}).unwrap()
			onClose()
		} catch (err) {
			console.error('Failed to update ticket:', err)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='max-w-5xl mx-auto p-2 border shadow-lg'
		>
			<div className='grid grid-cols-1 gap-6'>
				<div>
					<label className='block text-sm font-medium'>Название</label>
					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleChange}
						className='w-full p-2 border rounded'
						required
					/>
				</div>

				<div>
					<label className='block text-sm font-medium'>Описание</label>
					<textarea
						name='description'
						value={formData.description}
						onChange={handleChange}
						className='w-full p-2 border rounded mt-0'
						rows='3'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium'>Статус</label>
					<select
						name='status'
						value={formData.status}
						onChange={handleChange}
						className='w-full p-2 border rounded'
					>
						<option value='Открыта'>Открыта</option>
						<option value='В работе'>В работе</option>
						<option value='Закрыта'>Закрыта</option>
					</select>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium'>Дата начала</label>
						<input
							type='date'
							name='startDate'
							value={formData.startDate}
							onChange={handleChange}
							className='w-full p-2 border rounded'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium'>Дедлайн</label>
						<input
							type='date'
							name='deadline'
							value={formData.deadline}
							onChange={handleChange}
							className='w-full p-2 border rounded'
						/>
					</div>
				</div>

				<div>
					<label className='block text-sm font-medium'>Комментарий</label>
					<textarea
						name='comment'
						value={formData.comment}
						onChange={handleChange}
						className='w-full p-2 border rounded mt-0'
						rows='2'
					/>
				</div>
			</div>

			<div className='mt-4 flex justify-end'>
				<button type='button' onClick={onClose} className='btn'>
					Отмена
				</button>
				<button type='submit' className='btn'>
					Сохранить
				</button>
			</div>
		</form>
	)
}
