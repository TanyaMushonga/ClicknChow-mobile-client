import { Text, useColorScheme, View } from "react-native";
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
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

const BottomSheetLayout = forwardRef<
  BottomSheet,
  {
    children: ReactNode;
    visible: boolean;
    onClose: () => void;
    point?: string | null;
    title?: string | null;
  }
>(({ children, visible, onClose, point, title }, ref) => {
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
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
      handleComponent={() => (
        <View className="pt-2 pb-1 border-b border-b-[#cfcccc] dark:border-b-border mb-2">
          <View className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center" />
          {title && (
            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center my-2">
              {title}
            </Text>
          )}
        </View>
      )}
    >
      <BottomSheetScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetLayout;
