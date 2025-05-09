import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        if (hasOnboarded === "true") {
          router.replace("/(root)/(tabs)/home");
        } else {
          router.replace("/(auth)/welcome");
        }
      } catch (error) {
        console.error("Error checking initial route:", error);
        router.replace("/(auth)/welcome");
      }
    };

    checkInitialRoute();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#df4124" />
    </View>
  );
};

export default Index;
