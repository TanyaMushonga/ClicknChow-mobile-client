import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { images } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const trendingItems = [
  {
    id: "1",
    name: "Grilled Chicken",
    restaurant: "Chicken House",
    image: images.chicken,
    rating: 4.8,
    price: 9.99,
    orders: 1243,
    deliveryTime: "15-20 min",
    distance: "0.5 mi",
    isTrending: true,
    trendingMetric: "+32% this week",
  },
  {
    id: "2",
    name: "Pasta Carbonara",
    restaurant: "Italian Place",
    image: images.pasta,
    rating: 4.6,
    price: 11.5,
    orders: 892,
    deliveryTime: "20-25 min",
    distance: "0.8 mi",
    isPopular: true,
    popularMetric: "Top seller",
  },
  {
    id: "3",
    name: "Sushi Platter",
    restaurant: "Sushi World",
    image: images.sushi,
    rating: 5.0,
    price: 21.5,
    orders: 756,
    deliveryTime: "25-30 min",
    distance: "1.2 mi",
    isNew: true,
    newMetric: "New in your area",
  },
  {
    id: "4",
    name: "Margherita Pizza",
    restaurant: "Pizza Palace",
    image: images.pizza,
    rating: 4.6,
    price: 11.5,
    orders: 1532,
    deliveryTime: "10-15 min",
    distance: "0.3 mi",
    isTrending: true,
    trendingMetric: "+45% this week",
  },
  {
    id: "5",
    name: "Cheeseburger sjbas s ad asd ada sda asda",
    restaurant: "Burger Joint ahns aasda ascuadscscasscs asdjakdas aas",
    image: images.burger,
    rating: 4.6,
    price: 13.5,
    orders: 2108,
    deliveryTime: "12-18 min",
    distance: "0.6 mi",
    isPopular: true,
    popularMetric: "Top seller",
  },
];

const TrendingNearYou = () => {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-4">
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
        scrollEnabled={false}
        data={trendingItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-4 bg-card dark:bg-card-dark rounded-lg shadow-sm overflow-hidden"
            style={{ elevation: 1 }}
          >
            <View className="flex-row">
              <View className="w-40 h-40 relative">
                <Image
                  source={item.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute bottom-1 right-1 bg-foreground p-2 rounded-full shadow-xl"
                  style={{ elevation: 3 }}
                  onPress={() => {}}
                >
                  <MaterialIcons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className="flex-1 p-2">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 flex-col gap-2 mr-3">
                    <Text
                      className="text-md font-semibold text-black dark:text-white"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-md text-foreground-muted dark:text-foreground-muted-dark"
                      numberOfLines={2}
                    >
                      {item.restaurant}
                    </Text>
                  </View>

                  {item.isTrending && (
                    <View className="bg-background dark:bg-background-dark px-2 py-1 rounded-full">
                      <Text className="text-sm text-black dark:text-white">
                        {item.trendingMetric}
                      </Text>
                    </View>
                  )}
                  {item.isPopular && (
                    <View className="bg-background dark:bg-background-dark px-2 py-1 rounded-full">
                      <Text className="text-sm text-black dark:text-white">
                        {item.popularMetric}
                      </Text>
                    </View>
                  )}
                  {item.isNew && (
                    <View className="bg-background dark:bg-background-dark px-2 py-1 rounded-full">
                      <Text className="text-sm text-black dark:text-white">
                        {item.newMetric}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center mt-1">
                  <FontAwesome name="star" size={12} color="#facc15" />
                  <Text className="text-sm ml-1 text-black dark:text-white">
                    {item.rating} ({item.orders.toLocaleString()}+ orders)
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color="#6b7280"
                      className="mr-1"
                    />
                    <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                      {item.deliveryTime}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#6b7280"
                      className="mr-1"
                    />
                    <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                      {item.distance}
                    </Text>
                  </View>

                  <Text className="text-sm font-semibold text-black dark:text-white">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TrendingNearYou;
