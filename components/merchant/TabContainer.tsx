import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface TabContainerProps {
  tabs: string[];
  children: React.ReactNode[];
}

export const TabContainer = ({ tabs, children }: TabContainerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1">
      <View
        className={`flex flex-row justify-around items-center border-b-2 px-4 ${
          colorScheme === "dark" ? "border-b-[#7b7a7a]" : "border-b-[#cfcccc]"
        }`}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(index)}
            className={`pb-3 pt-4 px-2 w-32 items-center ${
              activeTab === index ? "border-b-2" : ""
            }`}
            style={{
              borderBottomColor:
                activeTab === index ? "#ff5a3c" : "transparent",
            }}
          >
            <Text
              className={`text-lg font-bold ${
                activeTab === index
                  ? "text-primary dark:text-primary-dark"
                  : "text-black dark:text-white"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        key={tabs[activeTab]}
        className="flex-1"
      >
        {React.Children.toArray(children)[activeTab]}
      </Animated.View>
    </View>
  );
};
