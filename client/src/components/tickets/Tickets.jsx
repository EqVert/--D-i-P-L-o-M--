import { useState } from 'react'
import TicketsCreate from './TicketsCreate.jsx'
import TicketsList from './TicketsList.jsx'
import TicketEdit from './TicketEdit.jsx'

export default function Tickets() {
	const [editingTicket, setEditingTicket] = useState(null)

	const handleEdit = (ticket) => {
		setEditingTicket(ticket)
	}

	const handleCloseEdit = () => {
		setEditingTicket(null)
	}

	return (
		<>
			{editingTicket ? (
				<TicketEdit ticket={editingTicket} onClose={handleCloseEdit} />
			) : (
				<TicketsCreate />
			)}
			<TicketsList onEdit={handleEdit} />
		</>
	)
}
