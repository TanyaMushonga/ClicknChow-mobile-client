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
    <TouchableOpacity
      onPress={() => router.push("/search")}
      className="mx-3"
      style={[
        { padding: 10, borderRadius: 30 },
        colorScheme === "dark"
          ? { backgroundColor: "#171717" }
          : { backgroundColor: "#ecede9" },
      ]}
    >
      <View className="flex flex-row w-full">
        <View
          className="flex flex-row items-center space-x-4"
          style={{ display: "flex", gap: 3, alignItems: "center" }}
        >
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
