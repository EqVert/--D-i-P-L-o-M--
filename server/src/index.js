import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'

import { keycloak } from './auth/keycloak.js'
import cats from './routes/cats.js'
import tickets from './routes/tickets.js'
import users from './routes/users.js'

mongoose.connect(process.env.MONGO_URL)

const app = express()

app.use(cors())
app.use(express.json())
app.use(history())
app.use(express.static(process.cwd() + '/client'))
app.use(keycloak.middleware())

app.use('/cats', cats)
app.use('/tickets', tickets)
app.use('/users', users)

app.listen(8090, () => {
	console.log('Server is running')
})
