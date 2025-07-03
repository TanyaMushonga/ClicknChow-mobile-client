import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  restaurantName: string;
  restaurantPhone: string;
  items: OrderItem[];
  total: number;
  status: "preparing" | "ready" | "in_transit" | "delivered" | "cancelled";
  orderTime: string;
  estimatedDelivery?: string;
  deliveredTime?: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryType: "delivery" | "pickup";
  deliveryFee: number;
  subtotal: number;
  rating?: number;
  feedback?: string;
  trackingNumber?: string;
  cancelReason?: string;
}

type TabType = "active" | "past";

const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sample orders data
  const orders: Record<TabType, Order[]> = {
    active: [
      {
        id: "ORD-2025-001",
        restaurantName: "Mama Africa Kitchen",
        restaurantPhone: "+263 78 100 1000",
        items: [
          { id: "1", name: "Sadza & Beef Stew", quantity: 2, price: 8.5 },
          {
            id: "2",
            name: "Mazondo (Trotters)",
            quantity: 1,
            price: 12.0,
            specialInstructions: "Extra spicy",
          },
        ],
        subtotal: 29.0,
        deliveryFee: 2.5,
        total: 31.5,
        status: "preparing",
        orderTime: "Today, 2:30 PM",
        estimatedDelivery: "3:15 PM",
        deliveryAddress: "123 Samora Machel Ave, Harare",
        paymentMethod: "EcoCash",
        deliveryType: "delivery",
        trackingNumber: "TRK123456",
      },
      {
        id: "ORD-2025-002",
        restaurantName: "Urban Grill",
        restaurantPhone: "+263 77 200 2000",
        items: [
          { id: "3", name: "Chicken & Rice", quantity: 1, price: 10.0 },
          { id: "4", name: "Mixed Vegetables", quantity: 1, price: 4.0 },
        ],
        subtotal: 14.0,
        deliveryFee: 0.0,
        total: 14.0,
        status: "ready",
        orderTime: "Today, 2:45 PM",
        estimatedDelivery: "Ready for pickup",
        deliveryAddress: "456 Robert Mugabe Rd, Harare",
        paymentMethod: "Cash on Pickup",
        deliveryType: "pickup",
      },
      {
        id: "ORD-2025-003",
        restaurantName: "Ocean Basket",
        restaurantPhone: "+263 71 300 3000",
        items: [
          { id: "5", name: "Fish & Chips Combo", quantity: 3, price: 15.0 },
        ],
        subtotal: 45.0,
        deliveryFee: 3.0,
        total: 48.0,
        status: "in_transit",
        orderTime: "Today, 1:45 PM",
        estimatedDelivery: "2:45 PM",
        deliveryAddress: "789 Chinhoyi St, Harare",
        paymentMethod: "EcoCash",
        deliveryType: "delivery",
        trackingNumber: "TRK789012",
      },
    ],
    past: [
      {
        id: "ORD-2025-004",
        restaurantName: "Braai Masters",
        restaurantPhone: "+263 78 400 4000",
        items: [
          { id: "6", name: "Pork Ribs Full Rack", quantity: 1, price: 18.0 },
          { id: "7", name: "Sadza Portion", quantity: 2, price: 3.0 },
        ],
        subtotal: 24.0,
        deliveryFee: 2.5,
        total: 26.5,
        status: "delivered",
        orderTime: "Yesterday, 12:30 PM",
        deliveredTime: "Yesterday, 1:15 PM",
        deliveryAddress: "321 Borrowdale Rd, Harare",
        paymentMethod: "USD Cash",
        deliveryType: "delivery",
        rating: 5,
        feedback: "Excellent food and fast delivery!",
      },
      {
        id: "ORD-2025-005",
        restaurantName: "Lake View Restaurant",
        restaurantPhone: "+263 77 500 5000",
        items: [{ id: "8", name: "Kapenta & Sadza", quantity: 1, price: 7.5 }],
        subtotal: 7.5,
        deliveryFee: 0.0,
        total: 7.5,
        status: "cancelled",
        orderTime: "Jul 1, 11:45 AM",
        deliveryAddress: "654 Avondale Shopping Center",
        paymentMethod: "EcoCash",
        deliveryType: "pickup",
        cancelReason: "Restaurant was closed",
      },
    ],
  };

  const getStatusIcon = (
    status: Order["status"]
  ): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case "preparing":
        return "restaurant-outline";
      case "ready":
        return "checkmark-circle-outline";
      case "in_transit":
        return "car-outline";
      case "delivered":
        return "checkmark-done-outline";
      case "cancelled":
        return "close-circle-outline";
    }
  };

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case "preparing":
        return "#ff5a3c";
      case "ready":
        return "#3b82f6";
      case "in_transit":
        return "#8b5cf6";
      case "delivered":
        return "#10b981";
      case "cancelled":
        return "#f13b58";
    }
  };

  const formatStatus = (status: Order["status"]): string => {
    switch (status) {
      case "preparing":
        return "Being Prepared";
      case "ready":
        return "Ready for Pickup";
      case "in_transit":
        return "On the Way";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
    }
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCallRestaurant = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    Alert.alert(
      "Track Order",
      `Tracking: ${trackingNumber}\nFeature coming soon!`
    );
  };

  const handleReorderItems = (order: Order) => {
    Alert.alert("Reorder Items", "Add these items to your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add to Cart",
        onPress: () => console.log("Items added to cart"),
      },
    ]);
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => handleOrderPress(order)}
      className="bg-card dark:bg-card-dark mx-4 my-2 p-4 rounded-lg"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold dark:text-white mb-1">
            {order.restaurantName}
          </Text>
          <Text
            className="text-md font-medium"
            style={{ color: getStatusColor(order.status) }}
          >
            {formatStatus(order.status)}
          </Text>
        </View>
        <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
          {order.orderTime}
        </Text>
      </View>

      <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mb-2">
        {order.items.length} item{order.items.length > 1 ? "s" : ""} • $
        {order.total.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border bg-card">
            <Text className="text-lg font-semibold text-foreground">
              Order Details
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-8 h-8 rounded-full bg-background items-center justify-center"
            >
              <Ionicons name="close-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            {/* Restaurant Info */}
            <View className="bg-card m-4 p-4 rounded-lg border border-border">
              <Text className="text-lg font-semibold text-foreground mb-2">
                {selectedOrder.restaurantName}
              </Text>
              <Text className="text-sm text-foreground-muted mb-2">
                Order #{selectedOrder.id}
              </Text>
              <Text className="text-sm text-foreground-muted">
                {selectedOrder.orderTime}
              </Text>
            </View>

            {/* Status */}
            <View className="bg-card m-4 p-4 rounded-lg border border-border">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name={getStatusIcon(selectedOrder.status)}
                  size={20}
                  color={getStatusColor(selectedOrder.status)}
                />
                <Text
                  className="ml-2 text-base font-medium"
                  style={{ color: getStatusColor(selectedOrder.status) }}
                >
                  {formatStatus(selectedOrder.status)}
                </Text>
              </View>

              {selectedOrder.estimatedDelivery && activeTab === "active" && (
                <Text className="text-sm text-foreground-muted">
                  {selectedOrder.deliveryType === "delivery"
                    ? "Estimated Delivery: "
                    : "Ready: "}
                  {selectedOrder.estimatedDelivery}
                </Text>
              )}

              {selectedOrder.deliveredTime && (
                <Text className="text-sm text-foreground-muted">
                  Delivered: {selectedOrder.deliveredTime}
                </Text>
              )}
            </View>

            {/* Order Items */}
            <View className="bg-card m-4 p-4 rounded-lg border border-border">
              <Text className="text-base font-semibold text-foreground mb-3">
                Order Items
              </Text>
              {selectedOrder.items.map((item) => (
                <View
                  key={item.id}
                  className="flex-row justify-between items-start mb-2"
                >
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">
                      {item.quantity}x {item.name}
                    </Text>
                    {item.specialInstructions && (
                      <Text className="text-xs text-foreground-muted italic">
                        Note: {item.specialInstructions}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm font-medium text-foreground">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Delivery Info */}
            <View className="bg-card m-4 p-4 rounded-lg border border-border">
              <Text className="text-base font-semibold text-foreground mb-3">
                {selectedOrder.deliveryType === "delivery"
                  ? "Delivery Info"
                  : "Pickup Info"}
              </Text>
              <View className="flex-row items-start mb-2">
                <Ionicons name="location-outline" size={16} color="#4b5563" />
                <View className="ml-2 flex-1">
                  <Text className="text-sm font-medium text-foreground">
                    {selectedOrder.deliveryType === "delivery"
                      ? "Delivery Address"
                      : "Pickup Location"}
                  </Text>
                  <Text className="text-sm text-foreground-muted">
                    {selectedOrder.deliveryAddress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Total */}
            <View className="bg-card m-4 p-4 rounded-lg border border-border">
              <Text className="text-base font-semibold text-foreground mb-3">
                Order Summary
              </Text>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-foreground-muted">Subtotal</Text>
                <Text className="text-sm text-foreground">
                  ${selectedOrder.subtotal.toFixed(2)}
                </Text>
              </View>
              {selectedOrder.deliveryFee > 0 && (
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-foreground-muted">
                    Delivery Fee
                  </Text>
                  <Text className="text-sm text-foreground">
                    ${selectedOrder.deliveryFee.toFixed(2)}
                  </Text>
                </View>
              )}
              <View className="border-t border-border pt-2 mt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-semibold text-foreground">
                    Total
                  </Text>
                  <Text className="text-base font-semibold text-foreground">
                    ${selectedOrder.total.toFixed(2)}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-foreground-muted mt-2">
                Paid via {selectedOrder.paymentMethod}
              </Text>
            </View>

            {/* Rating (Past Orders) */}
            {activeTab === "past" && selectedOrder.rating && (
              <View className="bg-card m-4 p-4 rounded-lg border border-border">
                <Text className="text-base font-semibold text-foreground mb-2">
                  Your Rating
                </Text>
                <View className="flex-row items-center mb-2">
                  <View className="flex-row">
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={
                          i < selectedOrder.rating! ? "star" : "star-outline"
                        }
                        size={16}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                  <Text className="ml-2 text-sm text-foreground-muted">
                    {selectedOrder.rating}/5
                  </Text>
                </View>
                {selectedOrder.feedback && (
                  <Text className="text-sm text-foreground-muted italic">
                    "{selectedOrder.feedback}"
                  </Text>
                )}
              </View>
            )}

            {/* Cancel Reason */}
            {selectedOrder.status === "cancelled" &&
              selectedOrder.cancelReason && (
                <View className="bg-card m-4 p-4 rounded-lg border border-destructive">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color="#f13b58"
                    />
                    <View className="ml-2 flex-1">
                      <Text className="text-sm font-medium text-destructive">
                        Order Cancelled
                      </Text>
                      <Text className="text-sm text-foreground-muted">
                        {selectedOrder.cancelReason}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
          </ScrollView>

          {/* Action Buttons */}
          <View className="bg-card border-t border-border p-4">
            {activeTab === "active" ? (
              <View className="flex-row space-x-3">
                {selectedOrder.trackingNumber && (
                  <TouchableOpacity
                    onPress={() =>
                      handleTrackOrder(selectedOrder.trackingNumber!)
                    }
                    className="flex-1 bg-primary py-3 rounded-lg"
                  >
                    <Text className="text-white font-medium text-center">
                      Track Order
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    handleCallRestaurant(selectedOrder.restaurantPhone)
                  }
                  className="flex-1 bg-background border border-border py-3 rounded-lg"
                >
                  <Text className="text-foreground font-medium text-center">
                    Call Restaurant
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handleReorderItems(selectedOrder)}
                className="bg-primary py-3 rounded-lg"
              >
                <Text className="text-white font-medium text-center">
                  Reorder Items
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-4">
        <Text className="text-3xl font-bold dark:text-white">My Orders</Text>
        <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md mt-1">
          Track your current and past orders
        </Text>
      </View>
      <View className=" flex-1">
        <View className="flex-row">
          {(["active", "past"] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-4 border-b-2 ${
                activeTab === tab ? "border-primary" : "border-border/30"
              }`}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text
                  className={`font-medium text-lg ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-foreground-muted dark:text-foreground-muted-dark"
                  }`}
                >
                  {tab === "active" ? "Active Orders" : "Past Orders"}
                </Text>
                <View className="bg-card dark:bg-foreground w-6 h-6 flex items-center justify-center rounded-full">
                  <Text className="text-md text-foreground dark:text-white font-medium">
                    {orders[tab].length}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={orders[activeTab]}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center px-8">
              <Ionicons name="receipt-outline" size={64} color="#4b5563" />
              <Text className="text-xl font-medium text-foreground mt-4 mb-2">
                No orders found
              </Text>
              <Text className="text-foreground-muted text-center">
                {activeTab === "active"
                  ? "You don't have any active orders."
                  : "You haven't made any orders yet."}
              </Text>
            </View>
          )}
        />
      </View>

      <OrderDetailsModal />
    </SafeAreaView>
  );
};

export default OrdersScreen;
