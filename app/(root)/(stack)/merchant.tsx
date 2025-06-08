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
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
import MerchantSkeleton from "@/components/merchant/merchantSkeleton";

const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 90 : 70;

const Merchant = () => {
  const { merchant } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const merchantData: MerchantsResponse | null = useMemo(
    () => (merchant ? JSON.parse(merchant as string) : null),
    [merchant]
  );

  const [activeOption, setActiveOption] = useState("Delivery");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredMenu, setFilteredMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const menu = useMemo(() => merchantData?.menu || null, [merchantData]);

  const filterProducts = useCallback(
    (products: Product[]) => {
      if (!products) return [];
      return products.filter((product) => {
        if (!product.availableFor) return false;
        switch (activeOption) {
          case "Delivery":
            return product.availableFor.includes("delivery");
          case "Pickup":
            return product.availableFor.includes("pickup");
          case "Dine in":
            return product.availableFor.includes("dine in");
          default:
            return true;
        }
      });
    },
    [activeOption]
  );

  useEffect(() => {
    if (!menu) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const filtered = {
      ...menu,
      categories: menu.categories
        ? menu.categories
            .map((category) => ({
              ...category,
              products: filterProducts(category.products || []),
            }))
            .filter((category) => category.products.length > 0)
        : [],
    };

    setFilteredMenu(filtered);

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [menu, activeOption, filterProducts]);

  const options = useMemo(
    () => [
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
    ],
    []
  );

  if (!merchantData || isLoading) {
    return <MerchantSkeleton />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0.3)"
        barStyle="light-content"
      />

      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
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
