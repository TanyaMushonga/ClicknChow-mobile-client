import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  useColorScheme,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";

// Mock data - replace with actual data from your cart
const mockOrderData = {
  store: {
    id: "store1",
    name: "Bella Vista Restaurant",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    deliveryType: "Delivery",
    estimatedTime: "25-35 mins",
  },
  items: [
    {
      id: "1",
      name: "Margherita Pizza",
      customizations: "Extra cheese, No olives",
      price: 18.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    },
    {
      id: "2",
      name: "Caesar Salad",
      customizations: "Dressing on the side",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    },
  ],
  orderNote: "Please ring the doorbell twice",
  subtotal: 44.97,
  deliveryFee: 2.99,
  serviceFee: 2.25,
  tax: 4.05,
  total: 54.26,
};

const paymentMethods = [
  { id: "card1", type: "card", last4: "4532", brand: "Visa", isDefault: true },
  {
    id: "card2",
    type: "card",
    last4: "8901",
    brand: "Mastercard",
    isDefault: false,
  },
  { id: "paypal", type: "paypal", email: "user@example.com", isDefault: false },
  { id: "apple", type: "apple", name: "Apple Pay", isDefault: false },
];

const Checkout: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0].id
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Oak Street, Apt 4B\nNew York, NY 10001"
  );
  const [contactPhone, setContactPhone] = useState("+1 (555) 987-6543");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();

  const tipPercentages = [15, 18, 20, 25];

  const calculateTip = (percentage: number) => {
    return (mockOrderData.subtotal * percentage) / 100;
  };

  const getFinalTotal = () => {
    return mockOrderData.total + tipAmount - promoDiscount;
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setPromoDiscount(5.0);
      Alert.alert("Success", "Promo code applied! You saved $5.00");
    } else if (promoCode.toLowerCase() === "first20") {
      setPromoDiscount(10.0);
      Alert.alert("Success", "Promo code applied! You saved $10.00");
    } else {
      Alert.alert("Invalid", "Promo code not found");
    }
  };

  const selectTip = (percentage: number) => {
    setTipAmount(calculateTip(percentage));
    setCustomTip("");
  };

  const setCustomTipAmount = (amount: string) => {
    setCustomTip(amount);
    setTipAmount(parseFloat(amount) || 0);
  };

  const placeOrder = async () => {
    setIsProcessing(true);

    // Mock order processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Order Placed!",
        `Your order has been confirmed. Estimated delivery time: ${mockOrderData.store.estimatedTime}`,
        [
          {
            text: "Track Order",
            onPress: () => {
              // Navigate to order tracking
              router.push("/tracking");
            },
          },
        ]
      );
    }, 2000);
  };

  const getPaymentIcon = (method: any) => {
    switch (method.type) {
      case "card":
        return method.brand === "Visa" ? "credit-card" : "credit-card";
      case "paypal":
        return "paypal";
      case "apple":
        return "apple";
      default:
        return "credit-card";
    }
  };

  const getPaymentDisplay = (method: any) => {
    switch (method.type) {
      case "card":
        return `${method.brand} •••• ${method.last4}`;
      case "paypal":
        return `PayPal (${method.email})`;
      case "apple":
        return "Apple Pay";
      default:
        return "Unknown";
    }
  };

  const renderOrderItem = (item: any, index: number) => (
    <View
      key={item.id}
      className="flex-row py-3 border-b border-border/10 dark:border-border/20"
    >
      <Image source={{ uri: item.image }} className="w-12 h-12 rounded-lg" />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium dark:text-white flex-1">
            {item.quantity}x {item.name}
          </Text>
          <Text className="text-base font-semibold dark:text-white ml-2">
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
        {item.customizations && (
          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mt-1">
            {item.customizations}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon
            name="arrow-left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold dark:text-white">Checkout</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: mockOrderData.store.logo }}
              className="w-20 h-20 rounded-lg"
            />
            <View className="flex-1 ml-3">
              <Text className="text-xl font-bold dark:text-white">
                {mockOrderData.store.name}
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                {mockOrderData.store.deliveryType} •{" "}
                {mockOrderData.store.estimatedTime}
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                {mockOrderData.store.address}
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Icon
                name="phone"
                size={20}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold dark:text-white">
              Delivery Address
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditingAddress(!isEditingAddress)}
            >
              <Icon
                name="edit-2"
                size={18}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          {isEditingAddress ? (
            <View>
              <TextInput
                className="border border-border/30 dark:border-border/50 rounded-lg p-3 text-base dark:text-white mb-3"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                placeholder="Enter delivery address"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 bg-foreground py-2 rounded-lg"
                  onPress={() => setIsEditingAddress(false)}
                >
                  <Text className="text-white text-center font-semibold">
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 border border-border/30 py-2 rounded-lg"
                  onPress={() => setIsEditingAddress(false)}
                >
                  <Text className="text-foreground dark:text-white text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-md dark:text-white">{deliveryAddress}</Text>
          )}
        </View>

        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold dark:text-white">
              Contact Phone
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditingPhone(!isEditingPhone)}
            >
              <Icon
                name="edit-2"
                size={18}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          {isEditingPhone ? (
            <View>
              <TextInput
                className="border border-border/30 dark:border-border/50 rounded-lg p-3 text-base dark:text-white mb-3"
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="Enter phone number"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                keyboardType="phone-pad"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 bg-foreground py-2 rounded-lg"
                  onPress={() => setIsEditingPhone(false)}
                >
                  <Text className="text-white text-center font-semibold">
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 border border-border/30 py-2 rounded-lg"
                  onPress={() => setIsEditingPhone(false)}
                >
                  <Text className="text-foreground dark:text-white text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-md dark:text-white">{contactPhone}</Text>
          )}
        </View>

        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold dark:text-white mb-3">
            Order Summary
          </Text>
          {mockOrderData.items.map(renderOrderItem)}
          {mockOrderData.orderNote && (
            <View className="mt-3 p-3 bg-background dark:bg-background-dark rounded-lg">
              <Text className="text-lg font-medium dark:text-white mb-1">
                Order Note:
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                {mockOrderData.orderNote}
              </Text>
            </View>
          )}
        </View>

        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold dark:text-white">
              Payment Method
            </Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
              <Text className="text-primary font-semibold">Change</Text>
            </TouchableOpacity>
          </View>
          {paymentMethods.find((p) => p.id === selectedPayment) && (
            <View className="flex-row items-center">
              <FontAwesome5
                name={getPaymentIcon(
                  paymentMethods.find((p) => p.id === selectedPayment)
                )}
                size={20}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-lg dark:text-white ml-3">
                {getPaymentDisplay(
                  paymentMethods.find((p) => p.id === selectedPayment)
                )}
              </Text>
            </View>
          )}
        </View>

        {/* Promo Code */}
        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold dark:text-white mb-3">
            Promo Code
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 border border-border/30 dark:border-border/50 rounded-lg p-3 text-base dark:text-white"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Enter promo code"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
            />
            <TouchableOpacity
              className="bg-foreground px-4 py-3 rounded-lg"
              onPress={applyPromoCode}
            >
              <Text className="text-white font-semibold">Apply</Text>
            </TouchableOpacity>
          </View>
          {promoDiscount > 0 && (
            <View className="flex-row items-center mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Icon name="check-circle" size={16} color="#10B981" />
              <Text className="text-green-600 dark:text-green-400 ml-2 font-medium">
                Promo applied! You saved ${promoDiscount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Tip */}
        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold dark:text-white mb-3">
            Add Tip
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {tipPercentages.map((percentage) => (
              <TouchableOpacity
                key={percentage}
                className={`px-4 py-2 rounded-lg border ${
                  tipAmount === calculateTip(percentage)
                    ? "bg-foreground border-foreground"
                    : "border-border/30 dark:border-border/50"
                }`}
                onPress={() => selectTip(percentage)}
              >
                <Text
                  className={`font-semibold ${
                    tipAmount === calculateTip(percentage)
                      ? "text-white"
                      : "text-foreground dark:text-white"
                  }`}
                >
                  {percentage}% (${calculateTip(percentage).toFixed(2)})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            className="border border-border/30 dark:border-border/50 rounded-lg p-3 text-base dark:text-white"
            value={customTip}
            onChangeText={setCustomTipAmount}
            placeholder="Custom tip amount"
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            keyboardType="numeric"
          />
        </View>

        {/* Order Total */}
        <View className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold dark:text-white mb-3">
            Order Total
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-md dark:text-white">Subtotal</Text>
              <Text className="text-md dark:text-white">
                ${mockOrderData.subtotal.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-md dark:text-white">Delivery Fee</Text>
              <Text className="text-md dark:text-white">
                ${mockOrderData.deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-md dark:text-white">Service Fee</Text>
              <Text className="text-md dark:text-white">
                ${mockOrderData.serviceFee.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-md dark:text-white">Tax</Text>
              <Text className="text-md dark:text-white">
                ${mockOrderData.tax.toFixed(2)}
              </Text>
            </View>
            {tipAmount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-md dark:text-white">Tip</Text>
                <Text className="text-md dark:text-white">
                  ${tipAmount.toFixed(2)}
                </Text>
              </View>
            )}
            {promoDiscount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-md text-green-600 dark:text-green-400">
                  Discount
                </Text>
                <Text className="text-md text-green-600 dark:text-green-400">
                  -${promoDiscount.toFixed(2)}
                </Text>
              </View>
            )}
            <View className="border-t border-border/20 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold dark:text-white">Total</Text>
                <Text className="text-lg font-bold dark:text-white">
                  ${getFinalTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="p-4 border-t border-border/15 dark:border-border/25">
        <TouchableOpacity
          className={`py-4 rounded-lg bg-foreground`}
          onPress={placeOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View className="flex-row items-center justify-center gap-2">
              <Icon name="loader" size={20} color={"white"} />
              <Text className="text-white text-lg font-semibold mr-2">
                Processing...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-semibold text-center">
              Place Order • ${getFinalTotal().toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
            <Text className="text-xl font-bold dark:text-white">
              Payment Methods
            </Text>
            <TouchableOpacity
              onPress={() => setShowPaymentModal(false)}
              className="p-2"
            >
              <Icon
                name="x"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 p-4">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center p-4 rounded-lg mb-3 border ${
                  selectedPayment === method.id
                    ? "bg-primary/10 border-primary"
                    : "bg-white dark:bg-foreground border-border/20"
                }`}
                onPress={() => {
                  setSelectedPayment(method.id);
                  setShowPaymentModal(false);
                }}
              >
                <FontAwesome5
                  name={getPaymentIcon(method)}
                  size={24}
                  color={
                    selectedPayment === method.id
                      ? "#007AFF"
                      : colorScheme === "dark"
                      ? "white"
                      : "black"
                  }
                />
                <View className="flex-1 ml-3">
                  <Text
                    className={`text-md font-medium ${
                      selectedPayment === method.id
                        ? "text-primary"
                        : "dark:text-white"
                    }`}
                  >
                    {getPaymentDisplay(method)}
                  </Text>
                  {method.isDefault && (
                    <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                      Default
                    </Text>
                  )}
                </View>
                {selectedPayment === method.id && (
                  <Icon name="check-circle" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="flex-row items-center p-4 rounded-lg border border-dashed border-border/50">
              <Icon
                name="plus"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-md font-medium dark:text-white ml-3">
                Add New Payment Method
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;
