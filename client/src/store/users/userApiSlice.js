import { createApi } from '@reduxjs/toolkit/query/react'
import { getBaseQuery } from '../utils.js'

export const userApiSlice = createApi({
	reducerPath: 'usersApi',
	tagTypes: ['Users'],
	baseQuery: getBaseQuery(),
	endpoints: (builder) => ({
		addUser: builder.mutation({
			query: () => ({
				url: `/users`,
				method: 'POST',
			}),
			invalidatesTags: ['Users'],
		}),
	}),
})

export const { useAddUserMutation } = userApiSlice
