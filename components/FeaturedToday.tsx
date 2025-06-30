import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const featuredItems = [
  {
    id: "1",
    image: images.food1,
    restaurant: "Burger Palace",
    category: "American • Burgers",
    deliveryTime: "15-20 min",
    rating: 4.8,
    promotion: "20% OFF",
  },
  {
    id: "2",
    image: images.pasta,
    restaurant: "Pasta Paradise",
    category: "Italian • Pasta",
    deliveryTime: "20-25 min",
    rating: 4.6,
    promotion: "Free Delivery",
  },
  {
    id: "3",
    image: images.sushi,
    restaurant: "Sushi World",
    category: "Japanese • Sushi",
    deliveryTime: "25-30 min",
    rating: 4.9,
    promotion: "Combo Deal",
  },
  {
    id: "4",
    image: images.pizza,
    restaurant: "Pizza Heaven",
    category: "Italian • Pizza",
    deliveryTime: "10-15 min",
    rating: 4.7,
    promotion: "30% OFF",
  },
];

const FeaturedToday = () => {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold  dark:text-white mb-3">
        Featured Today
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="relative mr-4"
            style={{ width: width - 70 }}
            activeOpacity={0.9}
          >
            <Image
              source={item.image}
              className="rounded-xl"
              style={{ width: width - 70, height: 180 }}
              resizeMode="cover"
            />
            <View
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            />

            <View className="absolute top-3 left-3 bg-primary px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">
                {item.promotion}
              </Text>
            </View>

            <View className="absolute bottom-4 left-4 right-4">
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-white text-lg font-bold">
                    {item.restaurant}
                  </Text>
                  <Text className="text-white/90 text-sm">{item.category}</Text>
                </View>
                <View className="bg-white/90 px-2 py-1 rounded-full flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="black" />
                  <Text className=" text-xs ml-1">{item.deliveryTime}</Text>
                </View>
              </View>

              {/* Rating */}
              <View className="flex-row items-center mt-2">
                <View className="bg-white/90 px-2 py-1 rounded-full flex-row items-center">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className=" text-xs ml-1">{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedToday;
