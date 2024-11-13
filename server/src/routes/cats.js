import express from 'express'

import { keycloak, kcAdminClient } from '../auth/keycloak.js'
import { Cat } from '../model/cat.js'

const router = express.Router()
router.use(keycloak.protect()) //Всё что ниже будет требовать авторизацию

router.post('/', async (req, res) => {
	//  Или router.post("/", (keycloak.protect([Роль ваторизации keycloak]), async (req, res)
	let cat = new Cat(req.body)
	let result = await cat.save()

	res.send(result).status(204)
})

router.get('/', async (req, res) => {
	let results = await Cat.find()

	res.send(results).status(200)
})

router.delete('/:id', async (req, res) => {
	try {
		const result = await Cat.findByIdAndDelete(req.params.id)
		if (result) {
			res.status(200).send({ message: 'Cat deleted successfully' })
		} else {
			res.status(404).send({ message: 'Cat not found' })
		}
	} catch (error) {
		res.status(500).send({ message: 'Error deleting cat' })
	}
})

export default router
