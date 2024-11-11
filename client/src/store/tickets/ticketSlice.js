import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	currentTicket: undefined,
}

const ticketSlice = createSlice({
	name: 'tickets',
	initialState,
	reducers: {
		ticketSelected: (state, { payload }) => {
			state.currentTicket = payload
		},
	},
})

export const { ticketSelected } = ticketSlice.actions

export const selectCurrentTicket = (state) => state.tickets.currentTicket

export default ticketSlice.reducer
