import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
  Alert,
  Linking,
  Dimensions,
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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

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
  phone: string;
}

interface Restaurant {
  name: string;
  address: string;
  prepTime: string;
  image: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface OrderTrackingProps {}

const OrderTracking: React.FC<OrderTrackingProps> = () => {
  const [currentStatus, setCurrentStatus] = useState<number>(3);
  const [estimatedTime, setEstimatedTime] = useState<number>(18);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Dummy GPS coordinates for real-time tracking
  const [driverLocation, setDriverLocation] = useState<Coordinates>({
    latitude: -17.8292,
    longitude: 31.0522,
  });

  const restaurantLocation: Coordinates = {
    latitude: -17.8216,
    longitude: 31.0492,
  };

  const customerLocation: Coordinates = {
    latitude: -17.8352,
    longitude: 31.0562,
  };

  // Route coordinates (dummy path from restaurant to customer)
  const routeCoordinates = [
    restaurantLocation,
    { latitude: -17.825, longitude: 31.051 },
    { latitude: -17.828, longitude: 31.053 },
    { latitude: -17.832, longitude: 31.055 },
    customerLocation,
  ];

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
    phone: "+263771234567", // Added phone number
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

  // Simulate real-time driver movement (dummy data)
  useEffect(() => {
    const moveDriver = () => {
      setDriverLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    };

    const driverMovementInterval = setInterval(moveDriver, 5000); // Update every 5 seconds

    return () => clearInterval(driverMovementInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Function to call driver
  const callDriver = async () => {
    try {
      const phoneNumber = driver.phone;
      const phoneUrl = `tel:${phoneNumber}`;

      Alert.alert("Call Driver", `Do you want to call ${driver.name}?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(phoneUrl).catch((err) => {
              Alert.alert("Error", "Unable to make phone call");
              console.error("Error making phone call:", err);
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Unable to initiate phone call");
      console.error("Phone call error:", error);
    }
  };

  // Function to center map on driver
  const centerMapOnDriver = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

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

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold dark:text-white">
              Live Tracking
            </Text>
            <TouchableOpacity onPress={centerMapOnDriver}>
              <Text className="text-primary text-md underline font-medium">
                Center on Driver
              </Text>
            </TouchableOpacity>
          </View>

          <View className="h-64 rounded-xl overflow-hidden">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude:
                  (restaurantLocation.latitude + customerLocation.latitude) / 2,
                longitude:
                  (restaurantLocation.longitude + customerLocation.longitude) /
                  2,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={true}
              showsScale={true}
            >
              <Marker
                coordinate={restaurantLocation}
                title={restaurant.name}
                description="Restaurant Location"
                pinColor="#FF6B35"
              >
                <View className="bg-orange-500 p-2 rounded-full">
                  <ChefHat size={20} color="white" />
                </View>
              </Marker>

              <Marker
                coordinate={customerLocation}
                title="Delivery Address"
                description={deliveryAddress.address}
                pinColor="#4CAF50"
              >
                <View className="bg-green-500 p-2 rounded-full">
                  <Home size={20} color="white" />
                </View>
              </Marker>

              <Marker
                coordinate={driverLocation}
                title={`${driver.name} - ${driver.vehicle}`}
                description="Driver Location"
                pinColor="#2196F3"
              >
                <View className="bg-blue-500 p-2 rounded-full">
                  <Truck size={20} color="white" />
                </View>
              </Marker>

              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#FF5A3C"
                strokeWidth={3}
              />
            </MapView>
          </View>
        </View>

        <View className="mb-6 bg-card dark:bg-card-dark rounded-xl p-4">
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
              <TouchableOpacity
                onPress={callDriver}
                className="w-10 h-10 bg-success rounded-full flex items-center justify-center"
              >
                <FontAwesome6 name="phone" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-10 h-10 rounded-full flex items-center justify-center"
                onPress={() => {
                  router.push("/chat");
                }}
              >
                <MaterialCommunityIcons
                  name="message-reply-text"
                  size={34}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-4 bg-card dark:bg-card-dark rounded-xl p-4">
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
              <Text className="font-bold text-lg dark:text-white">
                {restaurant.name}
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                {restaurant.address}
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                Prep time: {restaurant.prepTime}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4 bg-card dark:bg-card-dark p-4 rounded-xl">
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Order Summary
          </Text>
          <View className="">
            {orderItems.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-2"
              >
                <View className="flex-row items-center">
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mr-2">
                    {item.quantity}x
                  </Text>
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {item.name}
                  </Text>
                </View>
                <Text className="font-medium text-md text-foreground-muted dark:text-foreground-muted-dark">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="border-t border-border/25 pt-2 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  Subtotal
                </Text>
                <Text className="text-sm text-md text-foreground-muted dark:text-foreground-muted-dark">
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  Delivery Fee
                </Text>
                <Text className="text-sm text-md text-foreground-muted dark:text-foreground-muted-dark">
                  $2.99
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  Tax
                </Text>
                <Text className="text-sm text-md text-foreground-muted dark:text-foreground-muted-dark">
                  $2.20
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t-2 border-border/25">
                <Text className="font-bold text-lg dark:text-white">Total</Text>
                <Text className="font-bold text-lg dark:text-white">
                  ${(totalAmount + 2.99 + 2.2).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-4 bg-card dark:bg-card-dark rounded-xl p-4">
          <Text className="text-xl font-semibold dark:text-white mb-4">
            Delivery Address
          </Text>
          <View className="">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <Home
                  size={26}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-lg dark:text-white">
                  {deliveryAddress.label}
                </Text>
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mt-1">
                  {deliveryAddress.address}
                </Text>
                <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                  {deliveryAddress.city}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-8 gap-4">
          <TouchableOpacity className="flex-row items-center justify-center bg-foreground py-4 rounded-xl gap-2">
            <HelpCircle size={20} color={"white"} />
            <Text className="text-white font-medium text-lg">Need Help?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-center border border-destructive py-4 rounded-xl gap-2">
            <X size={20} color="red" />
            <Text className="text-destructive text-lg font-medium">
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderTracking;
