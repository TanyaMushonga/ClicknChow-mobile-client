import Swiper from "react-native-swiper";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { onboarding } from "@/constants/index";

const Welcome = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const swiperRef = React.useRef<Swiper | null>(null);

  const handleSkip = () => {
    router.push("/signIn");
  };

  const handleNext = () => {
    if (currentIndex === onboarding.length - 1) {
      router.push("/signIn");
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };

  return (
    <View className="flex flex-1 h-full relative">
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        activeDotColor="#fff"
        onIndexChanged={(index) => setCurrentIndex(index)}
        paginationStyle={{ bottom: 100 }}
        dot={
          <View className="w-8 h-2 mx-1 rounded-full bg-[#ffffff] opacity-40" />
        }
        activeDot={<View className="w-8 h-2 mx-1 bg-[#4895EF] rounded-full" />}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1 relative">
            <Image
              source={item.image}
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute w-full h-full bg-black opacity-50" />
            <View className="flex-1 items-center justify-end py-40">
              <Text className="text-4xl font-bold text-white mb-2">
                {item.title}
              </Text>
              <Text className="text-xl text-center text-white">
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
        <Text className="text-xl font-bold text-white">Skip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute bottom-6 z-10 w-[93%] items-center bg-[#51a9e7] p-4 mx-4 rounded-xl"
        onPress={handleNext}
      >
        <Text className="text-lg font-bold text-white">
          {currentIndex === onboarding.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;