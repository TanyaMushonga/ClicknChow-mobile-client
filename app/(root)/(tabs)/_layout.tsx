import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LocationHeader from "@/components/LocationHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  const cartCount = 5;

  const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
      <View
        style={[
          styles.tabBar,
          { backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff" },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          switch (route.name) {
            case "home":
              iconName = isFocused ? "home" : "home-outline";
              break;
            case "explore":
              iconName = isFocused ? "search" : "search-outline";
              break;
            case "order":
              iconName = isFocused ? "receipt" : "receipt-outline";
              break;
            case "profile":
              iconName = isFocused ? "person" : "person-outline";
              break;
            case "cart":
              iconName = isFocused ? "cart" : "cart-outline";
              break;
          }

          if (route.name === "cart") {
            return (
              <View key={route.key} style={styles.cartTabContainer}>
                <TouchableOpacity
                  style={[
                    styles.cartButton,
                    {
                      backgroundColor: "black",
                      shadowColor: colorScheme === "dark" ? "#fff" : "#000",
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    onPress();
                  }}
                >
                  <Ionicons
                    name={iconName}
                    size={28}
                    color={
                      isFocused
                        ? "#fff"
                        : colorScheme === "dark"
                        ? "#a0a0a0"
                        : "#fff"
                    }
                  />
                  {cartCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {cartCount > 9 ? "9+" : cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={
                  isFocused
                    ? "#df4124"
                    : colorScheme === "dark"
                    ? "#a0a0a0"
                    : "gray"
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? "#df4124"
                      : colorScheme === "dark"
                      ? "#a0a0a0"
                      : "gray",
                  },
                ]}
              >
                {options.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ height: "auto" }}
              className="border-b border-[#b9b9b8] dark:border-[#2d2d2c]"
            >
              <LocationHeader />
            </SafeAreaView>
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          header: () => (
            <SafeAreaView
              edges={["top"]}
              style={{ height: "auto" }}
              className="px-4 pt-3 border-b border-[#b9b9b8] dark:border-[#2d2d2c]"
            >
              <Text className=" dark:text-white font-bold text-2xl">
                Explore stores
              </Text>
            </SafeAreaView>
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{ title: "Cart", headerShown: false }}
      />
      <Tabs.Screen
        name="order"
        options={{ title: "Orders", headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 80,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  cartTabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: -10,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -2,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TabsLayout;
