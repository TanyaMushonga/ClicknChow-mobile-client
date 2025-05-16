import { View, Text, StatusBar, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { MerchantsResponse } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const Merchant = () => {
  const { merchant } = useLocalSearchParams();
  const merchantData: MerchantsResponse = merchant
    ? JSON.parse(merchant as string)
    : null;
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0.3)"
        barStyle="light-content"
      />
      <ScrollView>
        <View className="">
          <View className="relative h-52">
            <Image
              source={{ uri: merchantData.logo }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex items-center mt-3">
            <Text className="font-bold text-2xl text-black dark:text-white flex-col gap-4">
              {merchantData.name}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#facc15" />
                <Text className="text-md text-black dark:text-white ml-1">
                  {merchantData.rating}
                </Text>
              </View>
              <View>
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark ml-1">
                  •{"  "} {merchantData.numberOfRatings} + ratings
                </Text>
              </View>
            </View>
            <View className="flex flex-row mt-3">
              <Text>{merchantData.deliveryTime}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Merchant;
