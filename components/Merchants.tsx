import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { merchants } from "@/constants";
import { Merchant } from "@/types";
import { useBottomSheetStore } from "@/store";

const Merchants = () => {
  const [merchantList, setMerchantList] = useState(merchants);
  const showBottomSheet = useBottomSheetStore((state) => state.showBottomSheet);

  const toggleFavorite = (id: string) => {
    setMerchantList((prev: Merchant[]) =>
      prev.map((merchant: Merchant) =>
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
              <Image
                source={item.image}
                className="w-32 h-32 rounded-lg mr-4"
                resizeMode="cover"
              />

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
                    {item.deliveryFee} delivery
                  </Text>
                </View>

                {!item.isOpen && (
                  <Text className="text-sm text-black dark:text-white mt-2">
                    Currently closed
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Merchants;
