import express from 'express'

import { keycloak, kcAdminClient } from '../auth/keycloak.js'
import { Ticket } from '../model/ticket.js'

const router = express.Router()
router.use(keycloak.protect()) // Всё что ниже будет требовать авторизацию

router.post('/', async (req, res) => {
	const userId = req.kauth.grant.access_token.content.sub
	let ticket = new Ticket({ ...req.body, createdBy: userId })
	let result = await ticket.save()

	res.send(result).status(204)
})

router.get('/', async (req, res) => {
	const userId = req.kauth.grant.access_token.content.sub
	const roles = req.kauth.grant.access_token.content.realm_access.roles

	try {
		let tickets = []
		if (roles.includes('ROLE_ADMIN_TICKET')) {
			tickets = await Ticket.find()
		} else {
			tickets = await Ticket.find({ createdBy: userId })
		}

		// Получаем информацию о создателях для всех тикетов
		const enrichedTickets = await Promise.all(
			tickets.map(async (ticket) => {
				const creator = await kcAdminClient.users.findOne({
					id: ticket.createdBy,
				})

				return {
					...ticket.toObject(),
					creatorName: creator
						? `${creator.lastName || ''} ${creator.firstName || ''}`
						: 'Неизвестно',
				}
			})
		)

		res.send(enrichedTickets).status(200)
	} catch (error) {
		console.error('Error fetching tickets:', error)
		res.status(500).send('Server error')
	}
})

router.delete('/:id', async (req, res) => {
	try {
		const result = await Ticket.findByIdAndDelete(req.params.id)
		if (result) {
			res.status(200).send({ message: 'Ticket deleted successfully' })
		} else {
			res.status(404).send({ message: 'Ticket not found' })
		}
	} catch (error) {
		res.status(500).send({ message: 'Error deleting ticket' })
	}
})

router.put('/:id', async (req, res) => {
	try {
		const userId = req.kauth.grant.access_token.content.sub
		const ticket = await Ticket.findOne({
			_id: req.params.id,
			createdBy: userId,
		})

		if (!ticket) {
			return res.status(404).send({ message: 'Ticket not found' })
		}

		const updatedTicket = await Ticket.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)

		res.json(updatedTicket)
	} catch (error) {
		res.status(500).send({ message: 'Error updating ticket' })
	}
})

export default router
