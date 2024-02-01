import { configureStore } from "@reduxjs/toolkit";
import stylesSlice from "@/app/slices/stylesSlice";
import groupSlice from "@/app/slices/groupSlice";

export const store = configureStore({
  reducer: {
    styles : stylesSlice,
    group: groupSlice,
  },
});
