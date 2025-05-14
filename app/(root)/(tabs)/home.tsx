import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import Banner from "@/components/banner";
import Filters from "@/components/filters";
import LastOrder from "@/components/last-order";
import TrendingNearYou from "@/components/treding-near-you";
import Search from "@/components/search";
import DealsAndCombos from "@/components/deals&combos";
import GroceriesAndEssentials from "@/components/Groceries&Essentials";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RecommendedForYou from "@/components/RecommendedForYou";
import MerchantsCloseBy from "@/components/merchantsCloseBy";

const Home = () => {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showMapButton, setShowMapButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const colorScheme = useColorScheme();

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScroll = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;

        setShowMapButton(currentScroll > 100);
        setIsAtBottom(currentScroll + layoutHeight >= contentHeight - 20);
      },
      useNativeDriver: false,
    }
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="px-3 pb-5"
      >
        <View className="flex-col gap-4">
          <Search />
          <Banner />
          <Filters />
          <LastOrder />
          <RecommendedForYou />
          <TrendingNearYou />
         <MerchantsCloseBy/>
          <GroceriesAndEssentials />
          <DealsAndCombos />
        </View>
      </ScrollView>

      {showMapButton && !isAtBottom && (
        <Animated.View
          className="absolute bottom-4 left-0 right-0 items-center"
          style={{
            opacity: scrollY.interpolate({
              inputRange: [100, 150],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [100, 150],
                  outputRange: [20, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/storemap")}
            className="bg-foreground dark:bg-background py-2 px-3 rounded-full shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="map"
                size={20}
                color={colorScheme === "dark" ? "#000" : "#fff"}
              />
              <Text className="text-white dark:text-foreground font-medium ml-2">
                View Map
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default Home;
