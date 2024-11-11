import mongoose, { Schema } from 'mongoose'

mongoose.model(
	'cats',
	new Schema({
		name: { type: String, required: true },
		colour: { type: String, required: true },
	})
)

export const Cat = mongoose.model('cats')
