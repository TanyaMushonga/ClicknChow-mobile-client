type BottomSheetContent = "filters" | "menu" | "profile" | null;

interface BottomSheetState {
  isVisible: boolean;
  content: BottomSheetContent;
  showBottomSheet: (content: BottomSheetContent) => void;
  hideBottomSheet: () => void;
  snapPoints: (string | number)[];
  setSnapPoints: (points: (string | number)[]) => void;
}