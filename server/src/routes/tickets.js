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

	// Если пользователь админ тикетов - показываем все тикеты, иначе только его
	let results = []
	if (roles.includes('ROLE_ADMIN_TICKET')) {
		results = await Ticket.find()
	} else {
		results = await Ticket.find({ createdBy: userId })
	}

	res.send(results).status(200)
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
