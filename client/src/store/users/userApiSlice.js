import { createApi } from '@reduxjs/toolkit/query/react'
import { getBaseQuery } from '../utils.js'

export const userApiSlice = createApi({
	reducerPath: 'usersApi',
	tagTypes: ['Users', 'Roles'],
	baseQuery: getBaseQuery(),
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => '/users',
			providesTags: ['Users'],
		}),
		addUser: builder.mutation({
			query: () => ({
				url: `/users`,
				method: 'POST',
			}),
			invalidatesTags: ['Users'],
		}),
		updateUser: builder.mutation({
			query: ({ id, data }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: data,
				// Добавляем заголовки
				headers: {
					'Content-Type': 'application/json',
				},
			}),
			// Оптимистичное обновление кэша
			async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedUser } = await queryFulfilled
					dispatch(
						userApiSlice.util.updateQueryData(
							'getUsers',
							undefined,
							(draft) => {
								const index = draft.findIndex((user) => user.id === id)
								if (index !== -1) {
									draft[index] = updatedUser
								}
							}
						)
					)
				} catch {}
			},
			invalidatesTags: ['Users'],
		}),
		getAvailableRoles: builder.query({
			query: () => '/users/roles',
			providesTags: ['Roles'],
		}),
	}),
})

export const {
	useAddUserMutation,
	useGetUsersQuery,
	useUpdateUserMutation,
	useGetAvailableRolesQuery,
} = userApiSlice
