import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const essentials = [
  {
    id: "1",
    name: "Eggs",
    price: "$3.99",
    image: "https://img.icons8.com/emoji/48/egg-emoji.png", // Example icon
  },
  {
    id: "2",
    name: "Milk",
    price: "$2.49",
    image: "https://img.icons8.com/emoji/48/glass-of-milk-emoji.png",
  },
  {
    id: "3",
    name: "Bread",
    price: "$1.99",
    image: "https://img.icons8.com/emoji/48/bread-emoji.png",
  },
  {
    id: "4",
    name: "Fruits",
    price: "$4.99",
    image: "https://img.icons8.com/emoji/48/red-apple.png",
  },
];

const GroceriesAndEssentials = () => {
  const colorScheme = useColorScheme();
  return (
    <View className="py-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold  dark:text-white">
          Grocery Essentials
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={essentials}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="relative h-42 bg-card dark:bg-card-dark rounded-lg p-3 mr-3 items-center shadow-sm w-32">
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 mb-2 bg-background dark:to-background-dark rounded-full"
              resizeMode="contain"
            />
            <View className="flex flex-col gap-2">
              <Text className="text-lg  dark:text-white text-center font-semibold">
                {item.name}
              </Text>
              <Text className="text-foreground dark:text-foreground-muted-dark text-sm">
                {item.price}
              </Text>
            </View>

            <TouchableOpacity
              className="absolute bottom-16 right-1 bg-foreground dark:bg-white p-2 rounded-full shadow-2xl"
              style={{ elevation: 3 }}
              onPress={() => {}}
            >
              <Ionicons
                name="bag-add-outline"
                size={24}
                color={colorScheme === "dark" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default GroceriesAndEssentials;
