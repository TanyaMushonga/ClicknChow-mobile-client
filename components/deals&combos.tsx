import { images } from "@/constants";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";

const deals = [
  {
    id: 1,
    title: "Family Meal Deal",
    desc: "4 Burgers, 2 Large Fries, 4 Drinks",
    brand: "KFC",
    originalPrice: 32.99,
    price: 26.39,
    discount: "20% OFF",
    endDate: "2025-05-16T14:30:00Z",
    image: images.burger,
  },
  {
    id: 2,
    title: "Pizza Tuesday",
    desc: "Buy any large pizza, get 1 free",
    brand: "Domino's",
    price: 19.99,
    endDate: "2025-05-18T14:30:00Z",
    image: images.pizza,
  },
];

function useCountdown(endDate: string) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, expired: false };
    };
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}

const DealBadge = ({ deal }: { deal: (typeof deals)[0] }) => {
  const { hours, minutes, seconds, expired } = useCountdown(deal.endDate);

  if (expired) return null;

  return (
    <View
      className={`absolute top-2 flex flex-row gap-2 items-center left-3 z-10 px-2.5 py-1.5 bg-foreground`}
    >
      <AntDesign name="clockcircle" size={11} color="white" />
      <Text className="text-white text-xs font-bold">
        Ends in {hours}h {minutes}m {seconds}s
      </Text>
    </View>
  );
};

const DealsAndCombos = () => {
  return (
    <View className="mt-4 mb-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-black dark:text-white">
          Deals & Combos
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-primary dark:text-primary-dark font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {deals.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            className="w-74 bg-card dark:bg-card-dark rounded-lg mr-4 mb-2 shadow-sm overflow-hidden"
          >
            <DealBadge deal={deal} />

            <View className="relative h-32 bg-gray-200 dark:bg-gray-700 items-center justify-center">
              <Image
                source={deal.image}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute bottom-2 right-1 bg-foreground p-2 rounded-full shadow-xl"
                style={{ elevation: 3 }}
                onPress={() => {}}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-bold text-lg text-black dark:text-white flex-1"
                  numberOfLines={1}
                >
                  {deal.title}
                </Text>
                {deal.discount && (
                  <View className="bg-primary/30 rounded-full p-1 px-2">
                    <Text className="text-primary font-bold text-xs">
                      {deal.discount}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-foreground dark:text-foreground-muted-dark text-md mt-1 mb-2">
                {deal.desc}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="text-black dark:text-white text-md font-semibold">
                  {deal.brand}
                </Text>

                <View className="flex-row items-center">
                  {deal.originalPrice && (
                    <Text className="text-foreground dark:text-foreground-muted-dark text-sm line-through mr-2">
                      ${deal.originalPrice.toFixed(2)}
                    </Text>
                  )}
                  <Text className="text-[#df4124] font-bold text-md">
                    ${deal.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DealsAndCombos;
