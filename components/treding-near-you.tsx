import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "@/constants";

const trendingItems = [
  {
    id: "1",
    name: "Grilled Chicken",
    restaurant: "Chicken House",
    image: images.chicken,
    rating: 4.8,
    price: 9.99,
  },
  {
    id: "2",
    name: "Pasta Carbonara",
    restaurant: "Italian Place",
    image: images.pasta,
    rating: 4.6,
    price: 11.5,
  },
  {
    id: "3",
    name: "Sushi Platter",
    restaurant: "Sushi World",
    image: images.sushi,
    rating: 5.0,
    price: 21.5,
  },
  {
    id: "4",
    name: "Margherita Pizza",
    restaurant: "Pizza Palace",
    image: images.pizza,
    rating: 4.6,
    price: 11.5,
  },
  {
    id: "5",
    name: "Cheeseburger",
    restaurant: "Burger Joint",
    image: images.burger,
    rating: 4.6,
    price: 13.5,
  },
];

const TrendingNearYou = () => {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xl font-semibold text-black dark:text-white">
          Trending Near You
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-primary dark:text-primary-dark font-semibold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trendingItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 w-56 bg-card dark:bg-card-dark rounded-xl shadow-md overflow-hidden">
            <View className="h-24 bg-gray-300 items-center justify-center">
              <Image source={item.image} className="w-full h-full" />
            </View>

            <View className="p-2">
              <Text className="text-md font-semibold text-black dark:text-white">
                {item.name}
              </Text>
              <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                {item.restaurant}
              </Text>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row items-center">
                  <FontAwesome name="star" size={12} color="#facc15" />
                  <Text className="text-sm ml-1 text-black dark:text-white">
                    {item.rating}
                  </Text>
                </View>
                <Text className="text-md font-semibold text-black dark:text-white">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TrendingNearYou;
