import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";

const AddMoney = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon
            name="arrow-left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-white">
          Add Payment Method
        </Text>
        <View className="w-10" />
      </View>
    </SafeAreaView>
  );
};

export default AddMoney;
