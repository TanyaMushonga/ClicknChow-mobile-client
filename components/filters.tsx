import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";

const Filters = () => {
  const [activeCategory, setActiveCategory] = React.useState("All");
  const colorScheme = useColorScheme();

  const categories = [
    {
      name: "All",
      icon: (
        <Ionicons
          name="fast-food"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Food",
      icon: (
        <MaterialIcons
          name="restaurant"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Groceries",
      icon: (
        <FontAwesome5
          name="shopping-basket"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Drinks",
      icon: (
        <MaterialCommunityIcons
          name="cup"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Coffee",
      icon: (
        <FontAwesome5
          name="coffee"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Desserts",
      icon: (
        <MaterialIcons
          name="icecream"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Gifts",
      icon: (
        <FontAwesome5
          name="gift"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
    {
      name: "Alcohol",
      icon: (
        <MaterialCommunityIcons
          name="glass-cocktail"
          color={colorScheme === "dark" ? "#fff" : "#000"}
          size={24}
        />
      ),
    },
  ];
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 10 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            className={`items-center mx-2 ${
              activeCategory === category.name ? "opacity-100" : "opacity-70"
            }`}
            onPress={() => setActiveCategory(category.name)}
          >
            <View
              className={`w-16 h-16 rounded-full items-center justify-center ${
                activeCategory === category.name ? "bg-primary" : "bg-gray-300"
              }`}
            >
              {category.icon}
            </View>
            <Text
              className={`mt-2 text-sm font-medium ${
                activeCategory === category.name
                  ? "text-primary"
                  : colorScheme === "dark"
                  ? "text-[#fff]"
                  : "text-[#000]"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Filters;
