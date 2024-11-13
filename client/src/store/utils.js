import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../config/index.js'
import { authService } from '../service/authService.js'

export function getBaseQuery() {
	return fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers) => {
			const authResult = authService.getToken()
			headers.set('Authorization', 'Bearer ' + authResult)
			headers.set('Accept', 'application/json')
			headers.set('Content-Type', 'application/json')
		},
	})
}
