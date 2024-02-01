import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  group: null,
  type: {
    group: "",
    list: "",
  },
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setGroup, setType } = groupSlice.actions;

export default groupSlice.reducer;
