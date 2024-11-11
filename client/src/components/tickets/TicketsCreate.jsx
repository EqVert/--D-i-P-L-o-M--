import { useState } from 'react'
import { useAddTicketMutation } from '../../store/tickets/ticketApiSlice.js'

export default function TicketsCreate() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState('Открыта')
	const [priority, setPriority] = useState('Средний')
	const [deadline, setDeadline] = useState('')
	const [plannedEffort, setPlannedEffort] = useState('')
	const [startDate, setStartDate] = useState('')
	const [comment, setComment] = useState('')
	const [popupMessage, setPopupMessage] = useState('')
	const [showPopup, setShowPopup] = useState(false)

	const [addTicket] = useAddTicketMutation()

	function submit(e) {
		e.preventDefault()

		addTicket({
			title,
			description,
			status,
			priority,
			deadline,
			plannedEffort,
			startDate,
			comment,
		})
			.then(() => {
				setPopupMessage('Заявка успешно создана!')
				setShowPopup(true)
				// Сброс значений состояний
				setTitle('')
				setDescription('')
				setStatus('Открыта')
				setPriority('Средний')
				setDeadline('')
				setPlannedEffort('')
				setStartDate('')
				setComment('')
			})
			.catch(() => {
				setPopupMessage('Ошибка при создании заявки!')
				setShowPopup(true)
			})
	}

	return (
		<>
			{showPopup && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white p-4 rounded shadow-lg'>
						<p>{popupMessage}</p>
						<button onClick={() => setShowPopup(false)} className='btn mt-4'>
							Закрыть
						</button>
					</div>
				</div>
			)}
			<form
				onSubmit={submit}
				className='max-w-5xl mx-auto p-2 border shadow-lg'
			>
				<h2 className='text-xl font-bold mb-6'>Нова заявка:</h2>

				<label className='block mt-5'>Найменування</label>
				<input
					onChange={(e) => setTitle(e.target.value)}
					value={title}
					type='text'
					placeholder='Найменування'
					required
					className='w-full p-2 border rounded'
				/>

				<label className='block mt-5'>Опис:</label>
				<textarea
					onChange={(e) => setDescription(e.target.value)}
					value={description}
					placeholder='Опис'
					required
					className='w-full p-2 border rounded mt-0'
				></textarea>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='block mt-5'>Статус</label>
						<select
							onChange={(e) => setStatus(e.target.value)}
							value={status}
							required
							className='w-full p-2 border rounded'
						>
							<option value='Открыта'>Відкрита</option>
							<option value='Закрыта'>Закрыта</option>
						</select>
					</div>

					<div>
						<label className='block mt-5'>Пріоритет</label>
						<select
							onChange={(e) => setPriority(e.target.value)}
							value={priority}
							required
							className='w-full p-2 border rounded'
						>
							<option value='Низкий'>Нізкий</option>
							<option value='Средний'>Середній</option>
							<option value='Высокий'>Високий</option>
						</select>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4'>
					<div>
						<label className='block mt-5'>Заплановані трудовитраты</label>
						<input
							onChange={(e) => setPlannedEffort(e.target.value)}
							value={plannedEffort}
							type='number'
							placeholder='Трудовитраты'
							required
							className='w-full p-2 border rounded'
						/>
					</div>

					<div>
						<label className='block mt-5'>Дата начала</label>
						<input
							onChange={(e) => setStartDate(e.target.value)}
							value={startDate}
							type='date'
							required
							className='w-full p-2 border rounded'
						/>
					</div>

					<div>
						<label className='block mt-5'>Крайний срок</label>
						<input
							onChange={(e) => setDeadline(e.target.value)}
							value={deadline}
							type='date'
							required
							className='w-full p-2 border rounded'
						/>
					</div>
				</div>

				<div className='mt-4 flex justify-end'>
					<button type='submit' className='btn'>
						Відправити
					</button>
				</div>
			</form>
		</>
	)
}
