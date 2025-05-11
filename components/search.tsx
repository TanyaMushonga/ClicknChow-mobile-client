import {
  View,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const Search = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <TouchableOpacity className="bg-primary p-2">
      <View className="flex flex-row w-full">
        <View className="flex flex-row items-center gap-4">
          <MaterialIcons
            name="search"
            size={26}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
          <Text className="text-black dark:text-white font-thin text-xl">
            Search food, groceries, stores...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Search;
