import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  View,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import {
  DietaryFilters,
  FeatureFilters,
  Filters,
  UpdatePriceRange,
} from "@/types";
import { deliveryTimes } from "@/constants";

const FilterSheet = React.memo(({ onClose }: { onClose: () => void }) => {
  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState<Filters>({
    deliveryTime: null,
    priceRange: [10, 50],
    dietary: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
    },
    features: {
      freeDelivery: false,
      openNow: true,
      deals: false,
    },
  });

  const categories = [
    { name: "All", icon: <Ionicons name="fast-food" size={24} /> },
    { name: "Food", icon: <MaterialIcons name="restaurant" size={24} /> },
    {
      name: "Groceries",
      icon: <FontAwesome5 name="shopping-basket" size={24} />,
    },
    { name: "Drinks", icon: <MaterialCommunityIcons name="cup" size={24} /> },
    { name: "Coffee", icon: <FontAwesome5 name="coffee" size={24} /> },
    { name: "Desserts", icon: <MaterialIcons name="icecream" size={24} /> },
  ];

  const toggleDietary = (key: keyof DietaryFilters) => {
    setFilters((prev) => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [key]: !prev.dietary[key],
      },
    }));
  };

  const toggleFeature = (key: keyof FeatureFilters) => {
    setFilters((prev: Filters) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const updatePriceRange: UpdatePriceRange = (index, value) => {
    const newRange: [number, number] = [...filters.priceRange] as [
      number,
      number
    ];
    newRange[index] = value;
    setFilters((prev: Filters) => ({ ...prev, priceRange: newRange }));
  };

  return (
    <View className="">
      <View className="flex items-end">
        <TouchableOpacity className="bg-primary/70 px-4 py-2 rounded-full">
          <Text className="text-white font-thin">Reset</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-6">
        <Text className="text-lg font-semibold  dark:text-white mb-3">
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
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
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  activeCategory === category.name
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {React.cloneElement(category.icon, {
                  color:
                    activeCategory === category.name
                      ? "#fff"
                      : colorScheme === "dark"
                      ? "#fff"
                      : "#000",
                })}
              </View>
              <Text
                className={`mt-2 text-sm ${
                  activeCategory === category.name
                    ? "text-primary font-semibold"
                    : "text-foreground-muted dark:text-foreground-muted-dark"
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold  dark:text-white mb-3">
          Delivery Time
        </Text>
        <View className="flex-row flex-wrap">
          {deliveryTimes.map((time) => (
            <TouchableOpacity
              key={time.label}
              className={`px-4 py-2 rounded-full mr-3 mb-2 ${
                filters.deliveryTime === time.value
                  ? "bg-primary"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onPress={() =>
                setFilters((prev) => ({ ...prev, deliveryTime: time.value }))
              }
            >
              <Text
                className={
                  filters.deliveryTime === time.value
                    ? "text-white"
                    : " dark:text-white"
                }
              >
                {time.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold  dark:text-white mb-3">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Text>
        <View className="flex-row justify-between">
          {[0, 1].map((index) => (
            <View key={index} className="w-[48%]">
              <Text className="text-foreground-muted dark:text-foreground-muted-dark mb-1">
                {index === 0 ? "Min" : "Max"} Price
              </Text>
              <View className="flex-row items-center bg-foreground-muted-dark dark:bg-foreground-muted rounded-lg px-3 py-1">
                <Text className=" dark:text-white">$</Text>
                <TextInput
                  className="flex-1 ml-2  dark:text-white"
                  keyboardType="numeric"
                  value={filters.priceRange[index].toString()}
                  onChangeText={(text) =>
                    updatePriceRange(index, parseInt(text) || 0)
                  }
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold  dark:text-white">Dietary</Text>
        {Object.entries(filters.dietary).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            className="flex-row justify-between items-center"
            onPress={() => toggleDietary(key as keyof DietaryFilters)}
          >
            <Text className=" dark:text-white capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </Text>
            <Switch
              value={value}
              onValueChange={() => toggleDietary(key as keyof DietaryFilters)}
              trackColor={{ false: "#d1d5db", true: "#ff5a3c" }}
              thumbColor={value ? "#fff" : "#f9fafb"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="mb-2">
        <Text className="text-lg font-semibold  dark:text-white">Features</Text>
        {Object.entries(filters.features).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            className="flex-row justify-between items-center"
            onPress={() => toggleFeature(key as keyof FeatureFilters)}
          >
            <Text className=" dark:text-white capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </Text>
            <Switch
              value={value}
              onValueChange={() => toggleFeature(key as keyof FeatureFilters)}
              trackColor={{ false: "#d1d5db", true: "#ff5a3c" }}
              thumbColor={value ? "#fff" : "#f9fafb"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="py-3 rounded-lg items-center bg-foreground"
        activeOpacity={0.8}
        onPress={() => onClose()}
      >
        <Text className="text-white font-bold text-lg">Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
});

export default FilterSheet;
