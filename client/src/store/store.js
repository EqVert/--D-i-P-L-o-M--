import { configureStore } from '@reduxjs/toolkit'
import { catApiSlice } from './cats/catApiSlice.js'
import catSlice from './cats/catSlice.js'
import { ticketApiSlice } from './tickets/ticketApiSlice.js'
import ticketSlice from './tickets/ticketSlice.js'
import { userApiSlice } from './users/userApiSlice.js'

export const store = configureStore({
	reducer: {
		cats: catSlice,
		[catApiSlice.reducerPath]: catApiSlice.reducer,
		tickets: ticketSlice,
		[ticketApiSlice.reducerPath]: ticketApiSlice.reducer,
		[userApiSlice.reducerPath]: userApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			catApiSlice.middleware,
			ticketApiSlice.middleware,
			userApiSlice.middleware
		),
})
