import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MerchantsResponse, OpeningHours } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getOpeningHoursForToday } from "@/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import DeliveryModeSelector from "@/components/merchant/DeliveryModeSelector";
import { TabContainer } from "@/components/merchant/TabContainer";
import FeaturedProducts from "@/components/merchant/featuredProducts";

const Merchant = () => {
  const { merchant } = useLocalSearchParams();
  const merchantData: MerchantsResponse = merchant
    ? JSON.parse(merchant as string)
    : null;
  const [activeOption, setActiveOption] = useState("Pickup");
  const colorScheme = useColorScheme();

  const options = [
    {
      id: 1,
      label: "Delivery",
      icon: <FontAwesome6 name="truck-fast" size={18} color="black" />,
    },
    {
      id: 2,
      label: "Pickup",
      icon: <Fontisto name="shopping-bag-1" size={18} color="black" />,
    },
    {
      id: 3,
      label: "Dine in",
      icon: (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={18}
          color="black"
        />
      ),
    },
  ];

  const router = useRouter();
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
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/storeinfor",
                  params: { merchant: JSON.stringify(merchantData) },
                });
              }}
            >
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
                <View className="flex flex-row items-center gap-1">
                  <MaterialIcons
                    name="location-pin"
                    size={14}
                    color="#6b7280"
                  />
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {merchantData.distance}
                  </Text>
                  <Entypo
                    name="chevron-small-right"
                    size={20}
                    color="#6b7280"
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View className="flex flex-row items-center gap-2 mt-3 bg-primary/15 px-2 py-1 rounded-md">
              <Text className="text-xs text-primary font-bold">
                {merchantData.orders.toLocaleString()}+ people ordered
              </Text>
            </View>
            <View className="flex flex-row items-center gap-4">
              <View className="flex flex-row mt-3 items-center gap-1">
                <MaterialCommunityIcons
                  name="bike-fast"
                  size={14}
                  color="#6b7280"
                />
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  {merchantData.deliveryTime}
                </Text>
              </View>

              <View className="flex flex-row mt-3 items-center gap-1">
                <FontAwesome name="clock-o" size={14} color="#6b7280" />
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  {merchantData.status}
                  {" • " +
                    getOpeningHoursForToday(
                      merchantData.openingHours as unknown as OpeningHours
                    )}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-start gap-1 my-4 mx-2 bg-neutral/10 rounded-full p-1 w-[75%]">
            {options.map((option) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveOption(option.label);
                }}
                key={option.id}
              >
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  className={`flex flex-row items-center ${
                    activeOption === option.label
                      ? "opacity-100 bg-white dark:bg-neutral/60"
                      : "opacity-70"
                  } p-2 rounded-full gap-2 `}
                >
                  {React.cloneElement(option.icon, {
                    color:
                      activeOption === option.label
                        ? colorScheme === "dark"
                          ? "white"
                          : "black"
                        : colorScheme === "dark"
                        ? "#a3a3a3"
                        : "#525252",
                  })}
                  <Text
                    className={`text-md font-bold ${
                      activeOption === option.label
                        ? "text-black dark:text-white"
                        : "text-foreground-muted dark:text-foreground-muted-dark"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
          <TabContainer tabs={["Menu", "About", "Reviews"]}>
            <View>
              <FeaturedProducts />
            </View>
            <View>
              <Text>about</Text>
            </View>
            <View>
              <Text>reviews</Text>
            </View>
          </TabContainer>
        </View>
      </ScrollView>
    </View>
  );
};

export default Merchant;
