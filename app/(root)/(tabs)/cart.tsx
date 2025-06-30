import { CartData, CartItem, Store } from "@/types/cart";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const CartScreen: React.FC = () => {
  const [cartData, setCartData] = useState<CartData>({
    stores: [
      {
        id: "store1",
        name: "Burger Palace",
        logo: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100&h=100&fit=crop&crop=center",
        deliveryTime: "20-30 min",
        deliveryType: "Delivery",
        isExpanded: true,
        items: [
          {
            id: "item1",
            name: "Classic Cheeseburger",
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&crop=center",
            customizations: "No onions, Extra cheese",
            price: 12.99,
            quantity: 2,
          },
          {
            id: "item2",
            name: "Large Fries",
            image:
              "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=100&h=100&fit=crop&crop=center",
            customizations: "Extra salt",
            price: 4.99,
            quantity: 1,
          },
        ],
        deliveryFee: 2.99,
        tax: 1.49,
      },
      {
        id: "store2",
        name: "Sweet Treats",
        logo: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=100&h=100&fit=crop&crop=center",
        deliveryTime: "15 min",
        deliveryType: "Pickup",
        isExpanded: false,
        items: [
          {
            id: "item3",
            name: "Chocolate Cake",
            image:
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop&crop=center",
            customizations: "No nuts",
            price: 8.99,
            quantity: 1,
          },
          {
            id: "item4",
            name: "Vanilla Milkshake",
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100&h=100&fit=crop&crop=center",
            customizations: "Extra whipped cream",
            price: 5.99,
            quantity: 1,
          },
        ],
        deliveryFee: 0.0,
        tax: 0.89,
      },
    ],
    savedForLater: [
      {
        id: "saved1",
        name: "Chocolate Shake",
        description: "Extra whipped cream",
        image:
          "https://images.unsplash.com/photo-1541544181051-e46607201e69?w=100&h=100&fit=crop&crop=center",
        price: 5.99,
        storeId: "store1",
      },
    ],
  });

  const colorScheme = useColorScheme();

  const toggleStoreExpansion = (storeId: string): void => {
    setCartData((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? { ...store, isExpanded: !store.isExpanded }
          : store
      ),
    }));
  };

  const updateQuantity = (
    storeId: string,
    itemId: string,
    newQuantity: number
  ): void => {
    if (newQuantity < 1) {
      removeItem(storeId, itemId);
      return;
    }

    setCartData((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
              ),
            }
          : store
      ),
    }));
  };

  const removeItem = (storeId: string, itemId: string): void => {
    setCartData((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.filter((item) => item.id !== itemId),
            }
          : store
      ),
    }));
  };

  const saveForLater = (storeId: string, item: CartItem): void => {
    setCartData((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.filter((cartItem) => cartItem.id !== item.id),
            }
          : store
      ),
      savedForLater: [
        ...prev.savedForLater,
        {
          id: `saved_${item.id}`,
          name: item.name,
          description: item.customizations,
          image: item.image,
          price: item.price,
          storeId: storeId,
        },
      ],
    }));
  };

  const moveToCart = (savedItemId: string): void => {
    const savedItem = cartData.savedForLater.find(
      (item) => item.id === savedItemId
    );
    if (!savedItem) return;

    const newCartItem: CartItem = {
      id: `moved_${Date.now()}`,
      name: savedItem.name,
      image: savedItem.image,
      customizations: savedItem.description,
      price: savedItem.price,
      quantity: 1,
    };

    setCartData((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === savedItem.storeId
          ? { ...store, items: [...store.items, newCartItem] }
          : store
      ),
      savedForLater: prev.savedForLater.filter(
        (item) => item.id !== savedItemId
      ),
    }));
  };

  const removeSavedItem = (savedItemId: string): void => {
    setCartData((prev) => ({
      ...prev,
      savedForLater: prev.savedForLater.filter(
        (item) => item.id !== savedItemId
      ),
    }));
  };

  const calculateStoreSubtotal = (store: Store): number => {
    return store.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateStoreTotal = (store: Store): number => {
    const subtotal = calculateStoreSubtotal(store);
    return subtotal + store.deliveryFee + store.tax;
  };

  const getTotalItemCount = (store: Store): number => {
    return store.items.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = (storeId: string): void => {
    const store = cartData.stores.find((s) => s.id === storeId);
    Alert.alert("Checkout", `Proceeding to checkout for ${store?.name}`);
  };

  const saveStoreForLater = (storeId: string): void => {
    const store = cartData.stores.find((s) => s.id === storeId);
    if (!store) return;

    store.items.forEach((item) => saveForLater(storeId, item));
  };

  // Empty State
  if (
    cartData.stores.every((store) => store.items.length === 0) &&
    cartData.savedForLater.length === 0
  ) {
    return (
      <SafeAreaView className="flex-1">
        <View className="bg-white dark:bg-[#000] px-4 py-3 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity>
            <Icon
              name="arrow-left"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold dark:text-white">My Cart</Text>
          <TouchableOpacity>
            <Icon
              name="more-vertical"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Icon name="shopping-cart" size={80} color="#D1D5DB" />
          <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
            Your cart is empty
          </Text>
          <Text className="text-base text-gray-500 text-center mb-6">
            Looks like you haven't added any items to your cart yet
          </Text>
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
            <Text className="text-white text-base font-semibold">
              Explore Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="bg-white dark:bg-[#000] px-4 py-3 flex-row items-center justify-between shadow-sm">
        <TouchableOpacity>
          <Icon
            name="arrow-left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold dark:text-white">My Cart</Text>
        <TouchableOpacity>
          <Icon
            name="more-vertical"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pb-6" showsVerticalScrollIndicator={false}>
        {cartData.stores.map(
          (store) =>
            store.items.length > 0 && (
              <View
                key={store.id}
                className="bg-white dark:bg-foreground mx-4 mt-4 rounded-xl shadow-sm"
              >
                <TouchableOpacity
                  className="p-3 flex-row items-center justify-between"
                  onPress={() => toggleStoreExpansion(store.id)}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: store.logo }}
                      className="w-20 h-20 rounded-md"
                    />
                    <View className="ml-3">
                      <Text className="text-xl font-bold dark:text-white mb-1">
                        {store.name}
                      </Text>
                      <View className="flex flex-row items-center">
                        <View
                          className={`bg-primary px-2 rounded-md ${
                            store.deliveryType === "Delivery"
                              ? "bg-[#ef0b37]"
                              : store.deliveryType === "Dine In"
                              ? "bg-[#283ed3]"
                              : store.deliveryType === "Pickup"
                              ? "bg-[#08b66d]"
                              : null
                          }`}
                        >
                          <Text className="text-sm text-white font-medium">
                            {store.deliveryType}
                          </Text>
                        </View>
                        <View className="px-2 py-0.5 rounded-full self-start">
                          <Text className="text-sm dark:text-white font-medium">
                            {store.deliveryTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Icon
                    name={store.isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>

                {store.isExpanded && (
                  <View className="border-t-2 border-border/25 dark:border-border/35">
                    {store.items.map((item, index) => (
                      <View
                        key={item.id}
                        className={`flex-row p-4 ${
                          index !== store.items.length - 1
                            ? "border-b border-border/15 dark:border-border/25"
                            : "border-b-2 border-border/25 dark:border-border/35"
                        }`}
                      >
                        <Image
                          source={{ uri: item.image }}
                          className="w-16 h-16 rounded-lg"
                        />
                        <View className="flex-1 ml-3">
                          <Text className="text-lg font-medium dark:text-white mb-1">
                            {item.name}
                          </Text>
                          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mb-2">
                            {item.customizations}
                          </Text>
                          <View className="flex-row items-center justify-center rounded-full border border-border/15 dark:border-border/25 w-36">
                            <TouchableOpacity
                              className="w-8 h-8 items-center justify-center"
                              onPress={() =>
                                updateQuantity(
                                  store.id,
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Icon
                                name="minus"
                                size={16}
                                color={
                                  colorScheme === "dark" ? "white" : "gray"
                                }
                              />
                            </TouchableOpacity>
                            <Text className="text-lg font-medium mx-3 min-w-8 text-center dark:text-white">
                              {item.quantity}
                            </Text>
                            <TouchableOpacity
                              className="w-8 h-8 items-center justify-center"
                              onPress={() =>
                                updateQuantity(
                                  store.id,
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Icon
                                name="plus"
                                size={16}
                                color={
                                  colorScheme === "dark" ? "white" : "gray"
                                }
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View className="items-end justify-between ml-4 min-w-20">
                          <Text className="text-base font-semibold text-foreground-muted dark:text-foreground-muted-dark">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                          <TouchableOpacity
                            className="bg-[#ef0b37] p-2 rounded-lg mt-2"
                            onPress={() => removeItem(store.id, item.id)}
                          >
                            <Icon name="trash-2" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    <View className="p-4 rounded-b-xl">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-md dark:text-white">
                          Subtotal
                        </Text>
                        <Text className="text-md dark:text-white">
                          ${calculateStoreSubtotal(store).toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-md dark:text-white">
                          Delivery Fee
                        </Text>
                        <Text className="text-md dark:text-white">
                          ${store.deliveryFee.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-md dark:text-white">Tax</Text>
                        <Text className="text-md dark:text-white">
                          ${store.tax.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between border-t border-border/15 pt-2 mt-2">
                        <Text className="text-base font-semibold dark:text-white">
                          Total ({getTotalItemCount(store)} items)
                        </Text>
                        <Text className="text-base font-semibold dark:text-white">
                          ${calculateStoreTotal(store).toFixed(2)}
                        </Text>
                      </View>

                      <View className="mt-4">
                        <TouchableOpacity
                          className="bg-foreground dark:bg-background-dark py-3 rounded-lg items-center mb-3"
                          onPress={() => proceedToCheckout(store.id)}
                        >
                          <Text className="text-white text-base font-semibold">
                            Proceed to Checkout
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="border border-border/50 py-3 rounded-lg items-center"
                          onPress={() => saveStoreForLater(store.id)}
                        >
                          <Text className="text-foreground-muted dark:text-foreground-muted-dark text-base font-semibold">
                            Save for Later
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )
        )}

        {cartData.savedForLater.length > 0 && (
          <View className="mx-4 mt-6">
            <View className="p-4">
              <Text className="text-xl font-semibold dark:text-white">
                Saved for Later
              </Text>
            </View>
            {cartData.savedForLater.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row p-4 ${
                  index !== cartData.savedForLater.length - 1
                    ? "border-b border-border/15 dark:border-border/25"
                    : ""
                }`}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-lg"
                />
                <View className="flex-1 ml-3 justify-center">
                  <Text className="text-lg font-medium dark:text-white mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mb-2">
                    {item.description}
                  </Text>
                  <Text className="text-lg font-semibold dark:text-white">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View className="justify-center items-end ml-4">
                  <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md mb-2"
                    onPress={() => moveToCart(item.id)}
                  >
                    <Text className="text-white text-sm font-semibold">
                      Move to Cart
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="border border-gray-300 px-4 py-2 rounded-md"
                    onPress={() => removeSavedItem(item.id)}
                  >
                    <Text className="text-gray-700 text-sm font-semibold">
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
