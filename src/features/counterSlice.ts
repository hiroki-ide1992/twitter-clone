import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    add: (state, action) => {
      state.value += 1;
    },
    down: (state, action) => {
      state.value -= 1;
    },
    reset: (state, action) => {
      state.value = 0;
    },
    inputUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { add, down, reset, inputUser } = counterSlice.actions;
export const counterState = (state: RootState) => state.counter.value;
export default counterSlice.reducer;
