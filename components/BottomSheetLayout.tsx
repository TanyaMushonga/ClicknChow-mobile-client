import { useColorScheme } from "react-native";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

const BottomSheetLayout = forwardRef<
  BottomSheet,
  {
    children: ReactNode;
    visible: boolean;
    onClose: () => void;
    point?: string;
  }
>(({ children, visible, onClose, point }, ref) => {
  const colorScheme = useColorScheme();

  const snapPoints = useMemo(() => [point ? point : "90%"], []);
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={true}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: colorScheme === "dark" ? "#212121" : "#ecede9",
      }}
      handleIndicatorStyle={{
        backgroundColor: colorScheme === "dark" ? "#6b7280" : "#9ca3af",
      }}
    >
      <BottomSheetScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetLayout;
