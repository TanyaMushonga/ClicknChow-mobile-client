import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

const filters = [
  { label: "Under 30 min" },
  { label: "4.5+ Rating" },
  { label: "$10–$20" },
  { label: "Pickup" },
  { label: "Delivery" },
  { label: "Open Now" },
  { label: "Offers" },
];

const ExploreFilters = () => {
  const [activeFilter, setActiveFilter] = useState(filters[0].label);

  return (
    <View className="mt-2 mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter, index) => {
          const isActive = activeFilter === filter.label;
          return (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 rounded-full mr-3 ${
                isActive
                  ? "bg-primary/20 border border-primary"
                  : "border border-border"
              }`}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter.label)}
            >
              <Text
                className={`text-sm ${
                  isActive ? "text-primary font-semibold" : "text-foreground-muted dark:text-foreground-muted-dark"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ExploreFilters;
