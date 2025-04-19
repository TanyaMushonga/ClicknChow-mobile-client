import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "order":
              iconName = focused ? "receipt" : "receipt-outline";
              break;
            case "cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#df4124",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#a0a0a0" : "gray",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff",
          paddingBottom: 5,
          height: 60,
          borderTopColor: colorScheme === "dark" ? "#2c2c2c" : "#e0e0e0",
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Orders",
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
