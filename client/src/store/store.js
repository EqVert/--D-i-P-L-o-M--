import { configureStore } from '@reduxjs/toolkit'
import { catApiSlice } from './cats/catApiSlice.js'
import catSlice from './cats/catSlice.js'
import { ticketApiSlice } from './tickets/ticketApiSlice.js'
import ticketSlice from './tickets/ticketSlice.js'

export const store = configureStore({
	reducer: {
		cats: catSlice,
		[catApiSlice.reducerPath]: catApiSlice.reducer,
		tickets: ticketSlice,
		[ticketApiSlice.reducerPath]: ticketApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			catApiSlice.middleware,
			ticketApiSlice.middleware
		),
})
