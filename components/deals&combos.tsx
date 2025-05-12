import { images } from "@/constants";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

const deals = [
  {
    id: 1,
    title: "Family Meal Deal",
    desc: "4 Burgers, 2 Large Fries, 4 Drinks",
    brand: "KFC",
    originalPrice: 32.99,
    price: 26.39,
    discount: "20% OFF",
    endDate: "2025-05-12T14:30:00Z",
    image: images.burger,
  },
  {
    id: 2,
    title: "Pizza Tuesday",
    desc: "Buy any large pizza, get 1 free",
    brand: "Domino's",
    price: 19.99,
    endDate: "2025-05-12T14:30:00Z",
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
    <View className={`absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-xl`}>
      <Text className="text-white text-xs font-bold">
        Ends in {hours}h {minutes}m {seconds}s
      </Text>
    </View>
  );
};

const DealsAndCombos = () => {
  return (
    <View className="mt-4 mb-2">
      <View className="flex-row justify-between items-center mb-3">
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
            className="w-64 bg-card dark:bg-card-dark rounded-2xl mr-4 mb-2 shadow-sm overflow-hidden"
          >
            <DealBadge deal={deal} />

            <View className="h-32 bg-gray-200 dark:bg-gray-700 items-center justify-center">
              <Image
                source={deal.image}
                className="w-full h-full"
                resizeMode="cover"
              />
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
                  <View className="bg-yellow-100 dark:bg-yellow-900 rounded-lg px-2 py-1 ml-2">
                    <Text className="text-[#df4124] font-bold text-xs">
                      {deal.discount}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">
                {deal.desc}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {deal.brand}
                </Text>

                <View className="flex-row items-center">
                  {deal.originalPrice && (
                    <Text className="text-gray-400 text-sm line-through mr-2">
                      ${deal.originalPrice.toFixed(2)}
                    </Text>
                  )}
                  <Text className="text-[#df4124] font-bold text-lg">
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
