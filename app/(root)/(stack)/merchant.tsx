import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  useColorScheme,
  Animated as RNAnimated,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Menu, MerchantsResponse, OpeningHours, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getOpeningHoursForToday } from "@/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TabContainer } from "@/components/merchant/TabContainer";
import FeaturedProducts from "@/components/merchant/featuredProducts";
import ProductMenu from "@/components/merchant/ProductsMenu";
import MoreToExplore from "@/components/merchant/MoreToExplore";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 90 : 70;

const Merchant = () => {
  const { merchant } = useLocalSearchParams();
  const merchantData: MerchantsResponse = merchant
    ? JSON.parse(merchant as string)
    : null;
  const [activeOption, setActiveOption] = useState("Delivery");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const [filteredMenu, setFilteredMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
    const menu = useMemo(() => merchantData?.menu, [merchantData]);

   useEffect(() => {
    if (!menu) return;
  
    setIsLoading(true);
  
    const filterProducts = (products: Product[]) => {
      return products.filter((product) => {
        switch (activeOption) {
          case "Delivery":
            return product.availableFor.some((option) => option === "delivery");
          case "Pickup":
            return product.availableFor.some((option) => option === "pickup");
          case "Dine in":
            return product.availableFor.some((option) => option === "dine in");
          default:
            return true;
        }
      });
    };
  
    const filtered = {
      ...menu,
      categories: menu.categories
        .map((category) => ({
          ...category,
          products: filterProducts(category.products),
        }))
        .filter((category) => category.products.length > 0),
    };
  
    setFilteredMenu(filtered);
  
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [menu, activeOption]);

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

  if (!merchantData || isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark p-4">
        <StatusBar translucent backgroundColor="transparent" />
        <SkeletonPlaceholder
          backgroundColor={colorScheme === "dark" ? "#1e293b" : "#f1f5f9"}
          highlightColor={colorScheme === "dark" ? "#334155" : "#e2e8f0"}
        >
          <View style={{ flexDirection: "column", gap: 16 }}>
            {/* Header Skeleton */}
            <View style={{ height: HEADER_MAX_HEIGHT, borderRadius: 8 }} />

            {/* Title Skeleton */}
            <View style={{ width: "70%", height: 32, borderRadius: 4 }} />

            {/* Rating Skeleton */}
            <View style={{ width: "50%", height: 20, borderRadius: 4 }} />

            {/* Order Options Skeleton */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ width: 100, height: 40, borderRadius: 20 }} />
              <View style={{ width: 100, height: 40, borderRadius: 20 }} />
              <View style={{ width: 100, height: 40, borderRadius: 20 }} />
            </View>

            {/* Menu Items Skeleton */}
            {[...Array(5)].map((_, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", gap: 12, marginTop: 16 }}
              >
                <View style={{ width: 100, height: 100, borderRadius: 8 }} />
                <View style={{ flex: 1 }}>
                  <View style={{ width: "70%", height: 20, borderRadius: 4 }} />
                  <View
                    style={{
                      width: "40%",
                      height: 16,
                      borderRadius: 4,
                      marginTop: 8,
                    }}
                  />
                  <View
                    style={{
                      width: "90%",
                      height: 14,
                      borderRadius: 4,
                      marginTop: 8,
                    }}
                  />
                  <View
                    style={{
                      width: "90%",
                      height: 14,
                      borderRadius: 4,
                      marginTop: 4,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0.3)"
        barStyle="light-content"
      />
      <RNAnimated.View style={[]}>
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black dark:text-white">
            {merchantData.name}
          </Text>
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </RNAnimated.View>

      <RNAnimated.View style={[styles.categoryTabs]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {filteredMenu?.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category.id
                  ? "bg-primary"
                  : "bg-neutral/10 dark:bg-neutral/20"
              }`}
            >
              <Text
                className={`font-medium ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-black dark:text-white"
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RNAnimated.View>

      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[]}
      >
        <RNAnimated.View style={[styles.headerImageContainer]}>
          <Image
            source={{ uri: merchantData.logo }}
            style={styles.headerImage}
            resizeMode="cover"
          />

          <View style={[styles.overlayButtons]} pointerEvents="auto">
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => {
                console.log("Back button pressed");
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-4">
              <TouchableOpacity style={styles.overlayButton}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.overlayButton}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.overlayButton}>
                <Ionicons name="ellipsis-vertical" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </RNAnimated.View>

        <View style={styles.content} className="pt-4">
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
            <View className="flex flex-col gap-8">
              {filteredMenu && (
                <>
                  <FeaturedProducts featuredProducts={{ menu: filteredMenu }} />
                  <ProductMenu menu={filteredMenu} />
                  <MoreToExplore merchantId={merchantData.id} />
                </>
              )}
              <MoreToExplore merchantId={merchantData.id} />
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

const styles = StyleSheet.create({
  headerImageContainer: {
    position: "relative",
    height: HEADER_MAX_HEIGHT,
    width: "100%",
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlayButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  overlayButton: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 8,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  categoryTabs: {
    position: "absolute",
    top: HEADER_MIN_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 99,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});

export default Merchant;
