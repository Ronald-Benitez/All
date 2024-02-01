import { createSlice } from "@reduxjs/toolkit";
import getStyles from "@/src/styles/styles";

const initialState = {
  styles: null,
};

export const stylesSlice = createSlice({
  name: "styles",
  initialState,
  reducers: {
    setStyles: (state, action) => {
      state.styles = action.payload;
    },
  },
});

export const initializeStyles = () => {
  return async (dispatch) => {
    const styles = await getStyles();
    dispatch(setStyles(styles));
  };
};

export const { setStyles } = stylesSlice.actions;

export default stylesSlice.reducer;
