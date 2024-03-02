import {configureStore} from "@reduxjs/toolkit";
import {catApiSlice} from "./cats/catApiSlice.js";
import catSlice from "./cats/catSlice.js";

export const store = configureStore({
  reducer: {
    cats: catSlice,
    [catApiSlice.reducerPath]: catApiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(
      catApiSlice.middleware
    )
  )
});