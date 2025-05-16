import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "@/constants";

const lastOrders = [
  {
    id: "1",
    name: "Double Whopper",
    restaurant: "Burger King",
    image: images.burger,
    price: 12.99,
    date: "May 2, 2025",
  },
  {
    id: "2",
    name: "Chicken Wings",
    restaurant: "KFC",
    image: images.chicken,
    price: 9.99,
    date: "Apr 28, 2025",
  },
  {
    id: "3",
    name: "Margherita Pizza",
    restaurant: "Pizza Hut",
    image: images.pizza,
    price: 14.5,
    date: "Apr 25, 2025",
  },
  {
    id: "4",
    name: "Sushi Platter",
    restaurant: "Sushi World",
    image: images.sushi,
    price: 18.75,
    date: "Apr 20, 2025",
  },
];

const LastOrder = () => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-black dark:text-white">
          Your Last Orders
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lastOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="mr-3 w-40"
            activeOpacity={0.8}
          >
            <View className="relative">
              <Image
                source={order.image}
                className="w-full h-24 rounded-md mb-2"
                resizeMode="cover"
              />
            </View>
            <Text
              className="text-lg font-semibold text-black dark:text-white"
              numberOfLines={1}
            >
              {order.name}
            </Text>
            <Text
              className="text-sm text-foreground dark:text-foreground-muted-dark"
              numberOfLines={1}
            >
              {order.restaurant}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
export default LastOrder;
