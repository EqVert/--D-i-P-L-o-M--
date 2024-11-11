import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../config'
import { authService } from '../../service/authService.js'

export const ticketApiSlice = createApi({
	reducerPath: 'ticketApi',
	tagTypes: ['Tickets'],
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers) => {
			const authResult = authService.getToken()
			headers.set('Authorization', 'Bearer ' + authResult)
			headers.set('Accept', 'application/json')
			headers.set('Content-Type', 'application/json')
		},
	}),
	endpoints: (builder) => ({
		fetchTickets: builder.query({
			query: () => `/tickets`,
			providesTags: ['Tickets'],
		}),
		addTicket: builder.mutation({
			query: (newTicket) => ({
				url: `/tickets`,
				method: 'POST',
				body: newTicket,
			}),
			invalidatesTags: ['Tickets'],
		}),
		deleteTicket: builder.mutation({
			query: (ticketId) => ({
				url: `/tickets/${ticketId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Tickets'],
		}),
	}),
})

export const {
	useFetchTicketsQuery,
	useAddTicketMutation,
	useDeleteTicketMutation,
} = ticketApiSlice
