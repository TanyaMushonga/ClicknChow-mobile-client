import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "@/constants";

const LastOrder = () => {
  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black dark:text-white">
          Your Last Order
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-primary dark:text-primary-dark font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <View className="bg-card dark:bg-card-dark rounded-xl shadow-sm p-4 flex flex-1 flex-row gap-4 items-center w-full">
        <View className="w-1/4">
          <Image source={images.burger} className="w-28 h-28 rounded-md" />
        </View>
        <View className="flex flex-col w-3/4 pe-3">
          <View className="rounded-xl flex-row justify-between items-center bg-green-300">
            <View className="flex flex-col">
              <Text className="text-xl font-semibold text-black dark:text-white">
                Burger King
              </Text>
              <Text className="text-md text-black dark:text-white mt-1">
                1x Double Whopper, 1x Fries
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-md text-black dark:text-white">
                May 2, 2025
              </Text>
              <Text className="text-lg font-bold text-black dark:text-white mt-1">
                $12.99
              </Text>
            </View>
          </View>
          <View className="flex-row mt-4">
            <TouchableOpacity className="flex-1 bg-primary py-2 rounded-full me-4">
              <Text className="text-center text-white font-semibold">
                Reorder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 border border-gray-300 dark:border-white py-2 rounded-full">
              <Text className="text-center text-black dark:text-white font-semibold">
                Rate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default LastOrder;
