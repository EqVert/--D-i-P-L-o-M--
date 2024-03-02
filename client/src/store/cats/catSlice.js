import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  currentCat: undefined
};

const catSlice = createSlice({
  name: "cats",
  initialState,
  reducers: {
    catSelected: (state, {payload}) => {
      state.currentCat = payload
    }
  }
});

export const {catSelected} = catSlice.actions;

export const selectCurrentCat = (state) => state.cats.currentCat;

export default catSlice.reducer;