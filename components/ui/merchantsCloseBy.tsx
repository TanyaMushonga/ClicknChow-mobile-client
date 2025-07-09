import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FontAwesome, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { images } from "@/constants";

const topMerchants: {
  id: string;
  name: string;
  cuisine: string;
  logo: any;
  rating: number;
  status: "open" | "busy" | "closed";
  distance: string;
  deliveryFee: string;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  sponsored: boolean;
}[] = [
  {
    id: "1",
    name: "Burger King",
    cuisine: "Fast Food",
    logo: images.food1,
    rating: 4.7,
    status: "open",
    distance: "0.8 km",
    deliveryFee: "$1.99",
    minDeliveryTime: 20,
    maxDeliveryTime: 30,
    sponsored: true,
  },
  {
    id: "2",
    name: "Chicken House",
    cuisine: "Grilled Chicken",
    logo: images.food2,
    rating: 4.8,
    status: "busy",
    distance: "1.2 km",
    deliveryFee: "Free",
    minDeliveryTime: 25,
    maxDeliveryTime: 40,
    sponsored: false,
  },
  {
    id: "3",
    name: "Italian Place",
    cuisine: "Pasta & Pizza",
    logo: images.food3,
    rating: 4.6,
    status: "closed",
    distance: "2.5 km",
    deliveryFee: "$2.49",
    minDeliveryTime: 30,
    maxDeliveryTime: 45,
    sponsored: true,
  },
];

const StatusBadge = ({ status }: { status: "open" | "busy" | "closed" }) => {
  const statusConfig = {
    open: { color: "bg-green-500", text: "Open", icon: "check-circle" },
    busy: { color: "bg-yellow-500", text: "Busy", icon: "clock" },
    closed: { color: "bg-red-500", text: "Closed", icon: "times-circle" },
  };

  return (
    <View
      className={`${statusConfig[status].color} px-2 py-1 rounded-full flex-row items-center`}
    >
      <FontAwesome5 name={statusConfig[status].icon} size={12} color="white" />
      <Text className="text-white text-xs ml-1">
        {statusConfig[status].text}
      </Text>
    </View>
  );
};

const MerchantsCloseBy = () => {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold  dark:text-white">
          Merchants close by
        </Text>
        <TouchableOpacity>
          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark font-semibold">
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={topMerchants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-4 w-64 bg-card dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
            {item.sponsored && (
              <View className="absolute top-2 left-2 bg-primary dark:bg-primary-dark px-2 py-1 rounded-full z-10">
                <Text className="text-white text-xs font-bold">Sponsored</Text>
              </View>
            )}
            <View className="h-32 bg-gray-200 dark:bg-gray-700 items-center justify-center relative">
              <Image
                source={item.logo}
                className="w-full h-full"
                resizeMode="cover"
              />

              <View className="absolute bottom-2 left-2 bg-background-dark">
                <StatusBadge status={item.status} />
              </View>
            </View>

            <View className="p-3">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold  dark:text-white"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mt-1">
                    {item.cuisine}
                  </Text>
                </View>

                <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  <FontAwesome name="star" size={12} color="#facc15" />
                  <Text className="text-sm font-semibold ml-1  dark:text-white">
                    {item.rating}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mt-3">
                <View className="flex-row items-center">
                  <MaterialIcons
                    name="delivery-dining"
                    size={20}
                    color="#666"
                  />
                  <Text className="text-sm text-foreground-muted dark:text-white ml-1">
                    {item.deliveryFee}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <FontAwesome5 name="clock" size={12} color="#666" />
                  <Text className="text-sm text-foreground-muted dark:text-white ml-1">
                    {item.minDeliveryTime}-{item.maxDeliveryTime} min
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <FontAwesome5 name="map-marker-alt" size={12} color="#666" />
                  <Text className="text-sm text-foreground-muted dark:text-white ml-1">
                    {item.distance}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MerchantsCloseBy;
