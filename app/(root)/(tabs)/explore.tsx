import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import Search from "@/components/search";
import Ionicons from "@expo/vector-icons/Ionicons";
import ExploreFilters from "@/components/ExploreFilters";
import Merchants from "@/components/merchant/MerchantsList";
import FilterSheet from "@/components/sheets/Filter-sheet";
import BottomSheetLayout from "@/components/BottomSheetLayout";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useBottomSheetStore } from "@/store";
import DisclaimerSheet from "@/components/sheets/DisclaimerSheet";

const Explore = () => {
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const filterBottomSheetRef = useRef<BottomSheetMethods | null>(null);
  const colorScheme = useColorScheme();

  const handleFilterClose = () => {
    if (filterSheetVisible) {
      filterBottomSheetRef.current?.close();
      setFilterSheetVisible(false);
      console.log("filter sheet");
    }
  };

  const { isVisible, hideBottomSheet } = useBottomSheetStore();
  const termsBottomSheetRef = useRef<BottomSheetMethods | null>(null);

  const handleTermsClose = () => {
    if (isVisible) {
      termsBottomSheetRef.current?.close();
      hideBottomSheet();
      console.log("terms sheet");
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView>
        <View className="px-3 pb-5">
          <View className="flex-row justify-between items-center">
            <Search />
            <TouchableOpacity
              className="p-2 flex-row items-center space-x-2"
              onPress={() => setFilterSheetVisible(true)}
            >
              <Ionicons
                name="filter"
                size={30}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
          <ExploreFilters />
          <Merchants />
        </View>
      </ScrollView>
      <BottomSheetLayout
        ref={filterBottomSheetRef}
        visible={filterSheetVisible}
        onClose={handleFilterClose}
        title={"Filters"}
      >
        <FilterSheet onClose={handleFilterClose} />
      </BottomSheetLayout>
      <BottomSheetLayout
        ref={termsBottomSheetRef}
        visible={isVisible}
        onClose={handleTermsClose}
        point={"60%"}
        title={"Recommendations and Promotions"}
      >
        <DisclaimerSheet onClose={handleTermsClose} />
      </BottomSheetLayout>
    </View>
  );
};

export default Explore;
