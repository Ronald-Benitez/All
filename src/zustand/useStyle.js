import { create } from "zustand";
import getStyles from "@/src/styles/styles";

const useStyle = create((set) => ({
  style: null,
  setStyle: (style) => set({ style }),
  getStyle: () => {
    if (!useStyle.getState().style) {
      getStyles().then((style) => {
        useStyle.getState().setStyle(style);
      });
    }
  },
}));

export default useStyle;
