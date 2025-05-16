import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import merchantsdata from "@/constants/merchantsData.json";

import { useBottomSheetStore } from "@/store";
import { useRouter } from "expo-router";
import { MerchantsResponse } from "@/types";
import { isStoreOpen } from "@/utils";

const Merchants = () => {
  const [imageLoading, setImageLoading] = useState(true);
  const normalizeStatus = (status: string): "open" | "closed" | "busy" => {
    const validStatuses = ["open", "closed", "busy"];
    return validStatuses.includes(status)
      ? (status as "open" | "closed" | "busy")
      : "closed";
  };

  const normalizeAvailableFor = (
    availableFor: string[]
  ): ("delivery" | "pickup")[] => {
    const validOptions = ["delivery", "pickup"];
    return availableFor.filter((option) => validOptions.includes(option)) as (
      | "delivery"
      | "pickup"
    )[];
  };

  const normalizeSpiceLevel = (
    spiceLevel: number
  ): 1 | 2 | 3 | 4 | 5 | undefined => {
    const validSpiceLevels = [1, 2, 3, 4, 5];
    return validSpiceLevels.includes(spiceLevel)
      ? (spiceLevel as 1 | 2 | 3 | 4 | 5)
      : undefined;
  };

  const normalizedMerchantsData = merchantsdata.map((merchant) => ({
    ...merchant,
    status: normalizeStatus(merchant.status),
    menu: {
      categories: merchant.menu.categories.map((category) => ({
        ...category,
        products: category.products.map((product) => ({
          ...product,
          availableFor: normalizeAvailableFor(product.availableFor),
          metrics: {
            ...product.metrics,
            spiceLevel: normalizeSpiceLevel(product.metrics.spiceLevel),
          },
        })),
      })),
    },
  }));

  const [merchantList, setMerchantList] = useState<MerchantsResponse[]>(
    normalizedMerchantsData
  );
  const showBottomSheet = useBottomSheetStore((state) => state.showBottomSheet);
  const router = useRouter();

  const toggleFavorite = (id: string) => {
    setMerchantList((prev: MerchantsResponse[]) =>
      prev.map((merchant: MerchantsResponse) =>
        merchant.id === id
          ? { ...merchant, isFavorite: !merchant.isFavorite }
          : merchant
      )
    );
  };

  return (
    <View className="">
      <FlatList
        data={merchantList}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-card dark:bg-card-dark rounded-xl p-4 mb-4"
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/merchant",
                params: { merchant: JSON.stringify(item) },
              })
            }
          >
            {item.isSponsored && (
              <TouchableOpacity
                className="self-start mb-2"
                onPress={() => showBottomSheet("filters")}
              >
                <Text className="text-primary dark:text-primary-dark text-md underline">
                  Sponsored
                </Text>
              </TouchableOpacity>
            )}

            <View className="flex-row items-start">
              <View className="w-32 h-32 rounded-lg mr-4 bg-gray-200 dark:bg-gray-700 justify-center items-center">
                {imageLoading && (
                  <ActivityIndicator size="small" color="#6b7280" />
                )}
                <Image
                  source={{ uri: item.logo }}
                  className="w-32 h-32 rounded-lg"
                  resizeMode="cover"
                  onLoadEnd={() => setImageLoading(false)}
                />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text
                      className="text-lg font-semibold text-black dark:text-white"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                      {item.orders.toLocaleString()}+ orders • {item.distance}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    <Ionicons
                      name={item.isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={item.isFavorite ? "#ef4444" : "#6b7280"}
                    />
                  </TouchableOpacity>
                </View>

                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mt-1">
                  {item.category}
                </Text>

                <View className="flex-row items-center mt-2">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="star" size={16} color="#facc15" />
                    <Text className="text-md text-black dark:text-white ml-1">
                      {item.rating}
                    </Text>
                  </View>

                  <View className="flex-row items-center mr-4">
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text className="text-md text-black dark:text-white ml-1">
                      {item.deliveryTime}
                    </Text>
                  </View>

                  <Text className="text-md text-black dark:text-white font-medium">
                    {item.deliveryFeeUSD} delivery
                  </Text>
                </View>

                <Text className="text-sm text-black dark:text-white mt-2">
                  {isStoreOpen(item.openingHours) ? "Open" : "Closed"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Merchants;
