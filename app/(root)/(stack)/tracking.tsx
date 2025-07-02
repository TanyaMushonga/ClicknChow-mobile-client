import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
} from "react-native";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Circle,
  Truck,
  ChefHat,
  Package,
  Home,
  HelpCircle,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Driver {
  name: string;
  rating: number;
  vehicle: string;
  photo: string;
}

interface Restaurant {
  name: string;
  address: string;
  prepTime: string;
  image: string;
}

interface OrderTrackingProps {}

const OrderTracking: React.FC<OrderTrackingProps> = () => {
  const [currentStatus, setCurrentStatus] = useState<number>(3);
  const [estimatedTime, setEstimatedTime] = useState<number>(18);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const orderStatuses = [
    {
      id: 1,
      title: "Order Received",
      subtitle: "12:25 PM",
    },
    {
      id: 2,
      title: "Restaurant is Preparing",
      subtitle: "12:27 PM",
    },
    {
      id: 3,
      title: "Driver Assigned",
      subtitle: "12:35 PM",
    },
    {
      id: 4,
      title: "Driver En Route to Restaurant",
      subtitle: "In Progress",
    },
    {
      id: 5,
      title: "Order Picked Up",
      subtitle: "Pending",
    },
    {
      id: 6,
      title: "Driver En Route to You",
      subtitle: "Pending",
    },
    {
      id: 7,
      title: "Delivered",
      subtitle: "Pending",
    },
  ];

  const orderItems: OrderItem[] = [
    { id: "1", name: "Classic Burger", quantity: 1, price: 12.99 },
    { id: "2", name: "Fries (Large)", quantity: 1, price: 4.99 },
    { id: "3", name: "Chocolate Shake", quantity: 1, price: 5.99 },
  ];

  const driver: Driver = {
    name: "Michael Johnson",
    rating: 4.8,
    vehicle: "Honda Civic",
    photo:
      "https://clicknchow.s3.us-east-1.amazonaws.com/profile/profile/FB_IMG_1724412641088.jpg",
  };

  const restaurant: Restaurant = {
    name: "Burger Bliss",
    address: "123 Main Street, Downtown",
    prepTime: "10-20 min",
    image:
      "https://clicknchow.s3.us-east-1.amazonaws.com/media/organisation/chicken+inn/burger.jpg",
  };

  const deliveryAddress = {
    label: "Home",
    address: "456 Park Avenue, Apt 7B",
    city: "New York, NY 10022",
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const StatusIcon = ({
    index,
    isActive,
  }: {
    index: number;
    isActive: boolean;
  }) => {
    return (
      <View>
        {isActive ? (
          <FontAwesome6 name="circle-check" size={24} color={"#ff5a3c"} />
        ) : (
          <View className="bg-card dark:bg-card-dark rounded-full w-7 h-7 flex items-center justify-center">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark">
              {index}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const ProgressLine = ({ isActive }: { isActive: boolean }) => (
    <View
      className={`w-1 flex-1 ${
        isActive ? "bg-primary" : "bg-neutral/30 dark:bg-card-dark"
      }`}
    />
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon
            name="arrow-left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-white">
          Order Tracking
        </Text>
        <View className="w-10" />
      </View>
      <ScrollView className="flex-1 p-4 bg-background dark:bg-background-dark">
        <View className="px-4 py-6 bg-card dark:bg-card-dark rounded-xl flex-row items-center justify-between mb-6">
          <View className="flex-col mb-2">
            <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark font-semibold">
              Estimated Delivery at
            </Text>
            <Text className="font-extrabold text-3xl dark:text-white">
              12:45 PM
            </Text>
            <Text className="text-md text-primary">
              Arriving by {estimatedTime} min
            </Text>
          </View>
          <View className="bg-background dark:bg-background-dark rounded-full p-2 w-16 h-16 flex items-center justify-center">
            <Text className="text-2xl font-bold text-primary">
              {estimatedTime}
            </Text>
            <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark font-semibold">
              mins
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Order Status
          </Text>
          <View className="space-y-1">
            {orderStatuses.map((status, index) => (
              <View key={status.id} className="flex-row items-start">
                <View className="flex-col items-center mr-3">
                  <StatusIcon
                    index={index + 1}
                    isActive={index < currentStatus}
                  />
                  {index < orderStatuses.length - 1 && (
                    <ProgressLine isActive={index < currentStatus - 1} />
                  )}
                </View>
                <View className="flex-1 pb-6">
                  <Text
                    className={`font-semibold text-lg ${
                      index < currentStatus
                        ? "text-primary"
                        : "text-foreground-muted dark:text-foreground-muted-dark"
                    }`}
                  >
                    {status.title}
                  </Text>
                  <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark mt-1">
                    {status.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Live Tracking
          </Text>
          <View className="h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
            <View className="absolute inset-0 opacity-20">
              <View className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200" />
            </View>
            <View className="relative z-10 items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <Truck size={24} className="text-white" />
              </View>
              <Text className="text-sm font-medium text-gray-700">
                Driver is on the way
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                <Text className="text-xs text-gray-600">Live location</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-6 bg-card dark:bg-card-dark border border-border/25 rounded-xl p-4">
          <Text className="text-xl font-semibold dark:text-white mb-2">
            Your Driver
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="rounded-full flex items-center justify-center mr-3">
                <Image
                  src={driver.photo}
                  width={65}
                  height={65}
                  className="rounded-full"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg dark:text-white">
                  {driver.name}
                </Text>
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  {driver.vehicle}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-md text-primary mr-1">★</Text>
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {driver.rating}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row gap-4">
              <TouchableOpacity className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <FontAwesome6 name="phone" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full flex items-center justify-center">
                <MaterialCommunityIcons
                  name="message-reply-text"
                  size={34}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="mx-4 mb-6 bg-gray-50 rounded-xl p-4">
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Restaurant
          </Text>
          <View className="flex-row items-center">
            <View className="bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Image
                src={restaurant.image}
                width={65}
                height={65}
                className="rounded-full"
              />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">
                {restaurant.name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {restaurant.address}
              </Text>
              <Text className="text-sm text-orange-600 mt-1">
                Prep time: {restaurant.prepTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="mx-4 mb-6">
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Order Summary
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            {orderItems.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-2"
              >
                <View className="flex-row items-center">
                  <Text className="text-gray-700 mr-2">{item.quantity}x</Text>
                  <Text className="text-gray-900">{item.name}</Text>
                </View>
                <Text className="font-medium text-gray-900">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Subtotal</Text>
                <Text className="text-sm text-gray-900">
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-sm text-gray-600">Delivery Fee</Text>
                <Text className="text-sm text-gray-900">$2.99</Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-sm text-gray-600">Tax</Text>
                <Text className="text-sm text-gray-900">$2.20</Text>
              </View>
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <Text className="font-semibold text-gray-900">Total</Text>
                <Text className="font-semibold text-gray-900">
                  ${(totalAmount + 2.99 + 2.2).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="mx-4 mb-6">
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Delivery Address
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <Home size={16} className="text-blue-600" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">
                  {deliveryAddress.label}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {deliveryAddress.address}
                </Text>
                <Text className="text-sm text-gray-600">
                  {deliveryAddress.city}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-4 mb-8 space-y-3">
          <TouchableOpacity className="flex-row items-center justify-center bg-blue-500 py-4 rounded-xl">
            <HelpCircle size={20} className="text-white mr-2" />
            <Text className="text-white font-medium">Need Help?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-center border border-red-300 py-4 rounded-xl">
            <X size={20} className="text-red-600 mr-2" />
            <Text className="text-red-600 font-medium">Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderTracking;
