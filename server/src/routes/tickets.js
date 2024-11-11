import express from 'express'

import keycloak from '../auth/keycloak.js'
import { Ticket } from '../model/ticket.js'

const router = express.Router()
router.use(keycloak.protect()) // Всё что ниже будет требовать авторизацию

router.post('/', async (req, res) => {
	let ticket = new Ticket(req.body)
	let result = await ticket.save()

	res.send(result).status(204)
})

router.get('/', async (req, res) => {
	let results = await Ticket.find()

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

export default router
