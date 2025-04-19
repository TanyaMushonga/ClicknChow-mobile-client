import Swiper from "react-native-swiper";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { onboarding } from "@/constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcome = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const swiperRef = React.useRef<Swiper | null>(null);

const handleSkip = async () => {
  try {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(root)/(tabs)/home");
  } catch (error) {
    console.error("Error saving onboarding status:", error);
  }
};

const handleNext = async () => {
  if (currentIndex === onboarding.length - 1) {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  } else {
    swiperRef.current?.scrollBy(1);
  }
};

  return (
    <View className="flex flex-1 h-full relative bg-background dark:bg-background">
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        activeDotColor="#fff"
        onIndexChanged={(index) => setCurrentIndex(index)}
        paginationStyle={{ bottom: 100 }}
        dot={
          <View className="w-8 h-2 mx-1 rounded-full bg-text-secondary opacity-40" />
        }
        activeDot={<View className="w-8 h-2 mx-1 rounded-full bg-primary" />}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1 relative">
            <Image
              source={item.image}
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute w-full h-full bg-text-primary opacity-50" />
            <View className="flex-1 items-center justify-end py-40">
              <Text className="text-4xl font-bold mb-2 text-background text-center">
                {item.title}
              </Text>
              <Text className="text-xl text-center text-background">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <TouchableOpacity
        className="absolute top-12 right-6 z-10"
        onPress={handleSkip}
      >
        <Text className="text-xl font-bold text-background">Skip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute bottom-6 z-10 w-[93%] items-center bg-primary dark:bg-primary p-4 mx-4 rounded-xl"
        onPress={handleNext}
      >
        <Text className="text-lg font-bold text-background">
          {currentIndex === onboarding.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
