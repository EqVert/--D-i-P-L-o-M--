import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../config"
import { authService } from "../../service/authService.js"

export const catApiSlice = createApi({
  reducerPath: "catApi",
  tagTypes: ["Cats"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const authResult = authService.getToken()
      headers.set("Authorization", "Bearer " + authResult)
      headers.set("Accept", "application/json")
      headers.set("Content-Type", "application/json")
    }
  }),
  endpoints: (builder) => ({
    fetchCats: builder.query({
      query: () => `/cats`,
      providesTags: ["Cats"]
    }),
    addCat: builder.mutation({
      query: (cat) => ({
        url: `/cats`,
        method: "POST",
        body: cat,
      }),
      invalidatesTags: ["Cats"],
    }),
    deleteCat: builder.mutation({
      query: (catId) => ({
        url: `/cats/${catId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cats'],
    }),
  })
})

export const { useFetchCatsQuery, useAddCatMutation, useDeleteCatMutation } = catApiSlice