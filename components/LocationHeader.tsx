import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { images } from "@/constants";
import { useRouter } from "expo-router";

export default function LocationHeader() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <>
      <View className="flex flex-row w-full justify-between items-center px-2 py-4 ">
        <TouchableOpacity onPress={() => router.push("/address")}>
          <View className="flex flex-row items-center gap-1">
            <MaterialIcons
              name="location-pin"
              size={36}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
            <View className="flex flex-col">
              <Text
                className=" dark:text-white font-semibold text-lg"
                style={{ lineHeight: 20 }}
              >
                Deliver to
              </Text>
              <View className="flex flex-row item items-center">
                <Text
                  className="text-foreground dark:text-foreground-muted-dark font-thin text-md"
                  style={{ lineHeight: 16 }}
                >
                  123, Main St, Nairobi
                </Text>
                <Entypo
                  name="chevron-small-down"
                  size={28}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={30}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
              source={images.placeholder}
              className="w-9 h-9 rounded-full border-2"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
