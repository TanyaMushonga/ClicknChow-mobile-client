import { create } from "zustand";
import { BottomSheetState } from "./types";

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isVisible: false,
  content: null,
  snapPoints: ["50%"],
  showBottomSheet: (content) => set({ isVisible: true, content }),
  hideBottomSheet: () => set({ isVisible: false, content: null }),
  setSnapPoints: (points) => set({ snapPoints: points }),
}));
