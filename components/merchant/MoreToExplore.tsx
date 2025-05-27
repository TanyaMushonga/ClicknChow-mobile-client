import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useMerchantsStore } from "@/store/merchants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MoreToExplore = ({ merchantId }: { merchantId: string }) => {
  const merchants = useMerchantsStore((state) => state.merchants);
  const moreToExplore = merchants.filter((store) => store.id !== merchantId);
  const router = useRouter();
  return (
    <View className="p-4">
      {moreToExplore.length > 0 && (
        <View>
          <Text className="text-2xl font-extrabold dark:text-white">
            MoreToExplore
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {moreToExplore?.map((explore) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/merchant",
                    params: { merchant: JSON.stringify(explore) },
                  });
                }}
                key={explore.id}
                className="w-[250px] bg-card dark:bg-card-dark mt-4 rounded-md"
              >
                <Image
                  source={{ uri: explore.logo }}
                  resizeMode="cover"
                  style={{ width: 250, height: 130 }}
                  className="rounded-md"
                />

                <View className="p-2 flex flex-row justify-between">
                  <Text className="dark:text-white text-xl gfont-bold">
                    {explore.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#facc15" />
                    <Text className="text-md text-black dark:text-white ml-1">
                      {explore.rating}
                    </Text>
                  </View>
                </View>
                <View className="p-2">
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {explore.distance}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MoreToExplore;
