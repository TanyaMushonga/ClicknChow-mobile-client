import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter, Tabs } from "expo-router";

const CustomHeader = () => {
  const route = useRouter();
  const imgUrl = null;
  return (
    <View className="flex-row justify-between items-center px-4 pt-10 pb-4 bg-white border-b border-gray-200">
      <Text className="text-3xl font-bold">Bophelo</Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-4"
          onPress={() => {
        
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full overflow-hidden"
          onPress={() => {
            route.push("/account");
          }}
        >
          {imgUrl ? (
            <Image
              source={{ uri: "https://example.com/profile-photo.jpg" }}
              className="w-8 h-8"
            />
          ) : (
            <View className="bg-gray-400 p-2">
              <AntDesign name="user" size={24} color="black" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "person"
            | "person-outline"
            | "people"
            | "people-outline"
            | "chatbox"
            | "chatbox-outline"
            | undefined;

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "patients") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "consultation") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "account") {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#51a9e7",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#f8f8f8",
          paddingBottom: 5,
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen name="patients" options={{ headerShown: false }} />
      <Tabs.Screen name="consultation" options={{ headerShown: false }} />
      <Tabs.Screen name="account" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default _layout;