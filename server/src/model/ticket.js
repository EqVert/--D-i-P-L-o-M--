import mongoose, { Schema } from 'mongoose'

const ticketSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		status: { type: String, required: true },
		priority: { type: String, required: true },
		deadline: { type: Date, required: true },
		plannedEffort: { type: Number, required: false },
		startDate: { type: Date, required: true },
		comment: { type: String, required: false },
		number: { type: Number, unique: true, required: true, default: 0 },
		createdBy: { type: String, required: true },
		acceptedBy: { type: String, required: true },
	},
	{
		timestamps: true, // Добавляет поля createdAt и updatedAt
	}
)

ticketSchema.index({ title: 1 }) // Индекс для поля title
ticketSchema.index({ status: 1 }) // Индекс для поля status

ticketSchema.pre('save', async function (next) {
	if (this.isNew) {
		const lastTicket = await mongoose
			.model('tickets')
			.findOne()
			.sort({ number: -1 })
		this.number = lastTicket ? lastTicket.number + 1 : 1
	}
	next()
})

mongoose.model('tickets', ticketSchema)

export const Ticket = mongoose.model('tickets')
