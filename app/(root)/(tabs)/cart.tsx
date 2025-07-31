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
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import cart from "@/constants/cart.json";

const suggestedItems = [
  {
    id: "suggest_1",
    name: "Garlic Bread",
    description: "Crispy bread with garlic butter",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400",
    price: 4.99,
  },
  {
    id: "suggest_2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with caesar dressing",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    price: 8.99,
  },
  {
    id: "suggest_3",
    name: "Mozzarella Sticks",
    description: "Crispy fried mozzarella with marinara sauce",
    image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400",
    price: 6.99,
  },
  {
    id: "suggest_4",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with fudge frosting",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    price: 5.99,
  },
];

const CartScreen: React.FC = () => {
  const [cartData, setCartData] = useState<CartData>(cart as CartData);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestionsModalVisible, setSuggestionsModalVisible] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const router = useRouter();

  const colorScheme = useColorScheme();

  const updateQuantity = (
    storeId: string,
    itemId: string,
    newQuantity: number
  ): void => {
    if (newQuantity < 1) {
      removeItem(storeId, itemId);
      return;
    }

    setCartData((prev) => {
      if (!prev) return prev;
      return {
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
      };
    });

    // Update selected store if modal is open
    if (selectedStore && selectedStore.id === storeId) {
      setSelectedStore((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
              ),
            }
          : null
      );
    }
  };

  const removeItem = (storeId: string, itemId: string): void => {
    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stores: prev.stores.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.filter((item) => item.id !== itemId),
              }
            : store
        ),
      };
    });

    // Update selected store if modal is open
    if (selectedStore && selectedStore.id === storeId) {
      setSelectedStore((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.id !== itemId),
            }
          : null
      );
    }
  };

  const saveForLater = (storeId: string, item: CartItem): void => {
    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stores: prev.stores.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.filter(
                  (cartItem) => cartItem.id !== item.id
                ),
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
      };
    });

    // Update selected store if modal is open
    if (selectedStore && selectedStore.id === storeId) {
      setSelectedStore((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((cartItem) => cartItem.id !== item.id),
            }
          : null
      );
    }
  };

  const moveToCart = (savedItemId: string): void => {
    const savedItem = cartData?.savedForLater.find(
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

    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stores: prev.stores.map((store) =>
          store.id === savedItem.storeId
            ? { ...store, items: [...store.items, newCartItem] }
            : store
        ),
        savedForLater: prev.savedForLater.filter(
          (item) => item.id !== savedItemId
        ),
      };
    });
  };

  const removeSavedItem = (savedItemId: string): void => {
    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stores: prev.stores,
        savedForLater: prev.savedForLater.filter(
          (item) => item.id !== savedItemId
        ),
      };
    });
  };

  const addSuggestedItemToCart = (suggestedItem: any): void => {
    if (!selectedStore) return;

    const newCartItem: CartItem = {
      id: `suggested_${Date.now()}`,
      name: suggestedItem.name,
      image: suggestedItem.image,
      customizations: suggestedItem.description,
      price: suggestedItem.price,
      quantity: 1,
    };

    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stores: prev.stores.map((store) =>
          store.id === selectedStore.id
            ? { ...store, items: [...store.items, newCartItem] }
            : store
        ),
      };
    });

    // Update selected store
    setSelectedStore((prev) =>
      prev
        ? {
            ...prev,
            items: [...prev.items, newCartItem],
          }
        : null
    );
  };

  const calculateStoreSubtotal = (store: Store): number => {
    return store?.items?.reduce(
      (total, item) => total + item?.price * item?.quantity,
      0
    );
  };

  const calculateStoreTotal = (store: Store): number => {
    const subtotal = calculateStoreSubtotal(store);
    return subtotal + store?.deliveryFee + store?.tax + store?.serviceFee;
  };

  const getTotalItemCount = (store: Store): number => {
    return store?.items?.reduce((total, item) => total + item?.quantity, 0);
  };

  const proceedToCheckout = (storeId: string): void => {
    const store = cartData?.stores.find((s) => s.id === storeId);
    router.push({
      pathname: "/checkout",
      params: { store: JSON.stringify(store) },
    });
  };

  const saveStoreForLater = (storeId: string): void => {
    const store = cartData?.stores.find((s) => s.id === storeId);
    if (!store) return;

    store.items.forEach((item) => saveForLater(storeId, item));
  };

  const openCartModal = (store: Store): void => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const closeCartModal = (): void => {
    setModalVisible(false);
    setSelectedStore(null);
    setOrderNote("");
  };

  const openSuggestionsModal = (): void => {
    // setModalVisible(false);
    setSuggestionsModalVisible(true);
  };

  const closeSuggestionsModal = (): void => {
    setSuggestionsModalVisible(false);
    setModalVisible(true);
  };

  const noThanksAndCheckout = (): void => {
    setSuggestionsModalVisible(false);
    setModalVisible(false);
    proceedToCheckout(selectedStore!.id);
    closeCartModal();
  };

  const viewStore = (storeId: string): void => {
    router.push({
      pathname: "/merchant",
      params: {
        merchant: JSON.stringify(
          cartData?.stores.find((s) => s.id === storeId)
        ),
      },
    });
  };

  const renderCartItem = ({
    item,
    index,
  }: {
    item: CartItem;
    index: number;
  }) => (
    <View
      className={`flex-row p-4 ${
        index !== (selectedStore?.items.length || 0) - 1
          ? "border-b border-border/15 dark:border-border/25"
          : ""
      }`}
    >
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg" />
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
              updateQuantity(selectedStore!.id, item.id, item.quantity - 1)
            }
          >
            <Icon
              name="minus"
              size={16}
              color={colorScheme === "dark" ? "white" : "gray"}
            />
          </TouchableOpacity>
          <Text className="text-lg font-medium mx-3 min-w-8 text-center dark:text-white">
            {item.quantity}
          </Text>
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center"
            onPress={() =>
              updateQuantity(selectedStore!.id, item.id, item.quantity + 1)
            }
          >
            <Icon
              name="plus"
              size={16}
              color={colorScheme === "dark" ? "white" : "gray"}
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
          onPress={() => removeItem(selectedStore!.id, item.id)}
        >
          <Icon name="trash-2" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestedItem = ({ item }: { item: any }) => {
    const isInCart = selectedStore?.items.some(
      (cartItem) => cartItem.name === item.name
    );
    const cartItem = selectedStore?.items.find(
      (cartItem) => cartItem.name === item.name
    );
    const quantity = cartItem?.quantity || 0;

    return (
      <View className="flex-row p-4 border-b border-border/15 dark:border-border/25">
        <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg" />
        <View className="flex-1 ml-3">
          <Text className="text-lg font-medium dark:text-white mb-1">
            {item.name}
          </Text>
          <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark mb-2">
            {item.description}
          </Text>
          <Text className="text-base font-semibold dark:text-white">
            ${item.price.toFixed(2)}
          </Text>
        </View>
        <View className="items-center justify-center ml-4">
          {isInCart ? (
            <View className="flex-row items-center justify-center rounded-full border border-border/15 dark:border-border/25 w-28">
              <TouchableOpacity
                className="w-8 h-8 items-center justify-center"
                onPress={() => {
                  if (cartItem) {
                    updateQuantity(
                      selectedStore!.id,
                      cartItem.id,
                      cartItem.quantity - 1
                    );
                  }
                }}
              >
                <Icon
                  name="minus"
                  size={16}
                  color={colorScheme === "dark" ? "white" : "gray"}
                />
              </TouchableOpacity>
              <Text className="text-lg font-medium mx-3 min-w-8 text-center dark:text-white">
                {quantity}
              </Text>
              <TouchableOpacity
                className="w-8 h-8 items-center justify-center"
                onPress={() => {
                  if (cartItem) {
                    updateQuantity(
                      selectedStore!.id,
                      cartItem.id,
                      cartItem.quantity + 1
                    );
                  } else {
                    addSuggestedItemToCart(item);
                  }
                }}
              >
                <Icon
                  name="plus"
                  size={16}
                  color={colorScheme === "dark" ? "white" : "gray"}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-foreground dark:bg-background-dark p-3 rounded-full"
              onPress={() => addSuggestedItemToCart(item)}
            >
              <Icon name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!cartData) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-1 items-center justify-center px-4">
          <Icon name="shopping-cart" size={80} color="#D1D5DB" />
          <Text className="text-2xl font-semibold dark:text-white mt-4 mb-2">
            Your cart is empty
          </Text>
          <Text className="text-lg text-foreground-muted dark:text-foreground-muted-dark text-center mb-6">
            Looks like you haven't added any items to your cart yet
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/explore");
            }}
          >
            <Text className="text-primary underline text-lg font-semibold">
              Explore Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1 pb-6" showsVerticalScrollIndicator={false}>
        {cartData?.stores.map(
          (store) =>
            store.items.length > 0 && (
              <View
                key={store.id}
                className="bg-card dark:bg-card-dark mx-4 mt-4 rounded-xl shadow-sm"
              >
                <View className="p-4">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: store.logo }}
                      className="w-20 h-20 rounded-md"
                    />
                    <View className="flex-1 flex-col gap-1 ml-3">
                      <Text className="text-xl font-bold dark:text-white">
                        {store.name}
                      </Text>
                      <View className="flex-row items-center gap-5">
                        <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                          {getTotalItemCount(store!)}{" "}
                          {getTotalItemCount(store!) === 1 ? "item" : "items"} •
                          $ {calculateStoreTotal(store!).toFixed(2)}
                        </Text>
                      </View>
                      {store.deliveryType === "Pickup" ? (
                        <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                          Pickup at {store.address}
                        </Text>
                      ) : store.deliveryType === "Delivery" ? (
                        <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                          {store.deliveryType}
                        </Text>
                      ) : store.deliveryType === "Dine In" ? (
                        <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                          Dine in at {store.address}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View className="flex-row mt-6 space-x-2">
                    <TouchableOpacity
                      className="flex-1 bg-foreground py-2.5 rounded-lg mr-2"
                      onPress={() => viewStore(store.id)}
                    >
                      <View className="flex-row items-center justify-center">
                        <FontAwesome5 name="store" size={16} color="white" />
                        <Text className="text-white text-sm font-semibold ml-1">
                          View Store
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 border border-border/50 py-2.5 rounded-lg mr-2"
                      onPress={() => openCartModal(store)}
                    >
                      <View className="flex-row items-center justify-center">
                        <Icon
                          name="shopping-cart"
                          size={16}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                        <Text className="text-foreground dark:text-white text-sm font-semibold ml-1">
                          View Cart
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
        )}

        {(cartData?.savedForLater?.length ?? 0) > 0 && (
          <View className="mx-4 mt-6">
            <Text className="text-xl font-semibold dark:text-white">
              Saved for Later
            </Text>
            {cartData?.savedForLater.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row mt-4 p-3 bg-card dark:bg-card-dark rounded-lg shadow-sm`}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="flex-1 ml-3 justify-center">
                  <Text className="text-xl font-bold dark:text-white">
                    {item.name}
                  </Text>
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {item.description}
                  </Text>
                  <Text className="text-lg font-semibold dark:text-white">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View className="justify-center items-end ml-4 w-30">
                  <TouchableOpacity
                    className="bg-foreground px-4 py-2 rounded-md mb-2 w-full items-center"
                    onPress={() => moveToCart(item.id)}
                  >
                    <Text className="text-white text-sm font-semibold">
                      Move to Cart
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="border border-border/50 px-4 py-2 rounded-md w-full items-center"
                    onPress={() => removeSavedItem(item.id)}
                  >
                    <Text className="dark:text-white text-sm font-semibold">
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Main Cart Modal */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={modalVisible}
        onRequestClose={closeCartModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
            <View className="flex-row items-center">
              <Image
                source={{ uri: selectedStore?.logo }}
                className="w-16 h-16 rounded-lg mr-3"
              />
              <View>
                <Text className="text-xl font-bold dark:text-white">
                  {selectedStore?.name}
                </Text>
                <View className="flex-row items-center gap-5">
                  <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                    {getTotalItemCount(selectedStore!)}{" "}
                    {getTotalItemCount(selectedStore!) === 1 ? "item" : "items"}{" "}
                    • $ {calculateStoreTotal(selectedStore!).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={closeCartModal} className="p-2">
              <Icon
                name="x"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <FlatList
              data={selectedStore?.items || []}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />

            {/* Order Note Section */}
            <View className="p-4 border-t border-border/15 dark:border-border/25">
              <Text className="text-lg font-semibold dark:text-white mb-3">
                Order Note
              </Text>
              <TextInput
                className="border border-border/30 dark:border-border/50 rounded-lg p-3 h-20 text-base dark:text-white"
                placeholder="Add any special instructions for your order..."
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                value={orderNote}
                onChangeText={setOrderNote}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View className="p-4 border-t border-border/15 dark:border-border/25">
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-md dark:text-white">Subtotal</Text>
                <Text className="text-md dark:text-white">
                  ${calculateStoreSubtotal(selectedStore!)?.toFixed(2)}
                </Text>
              </View>
              {selectedStore?.deliveryType === "Delivery" && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-md dark:text-white">Delivery Fee</Text>
                  <Text className="text-md dark:text-white">
                    ${selectedStore?.deliveryFee.toFixed(2)}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between mb-2">
                <Text className="text-md dark:text-white">Service Fee</Text>
                <Text className="text-md dark:text-white">
                  ${selectedStore?.serviceFee.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-md dark:text-white">Tax</Text>
                <Text className="text-md dark:text-white">
                  ${selectedStore?.tax.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between border-t border-border/15 pt-2 mt-2">
                <Text className="text-base font-semibold dark:text-white">
                  Total ({getTotalItemCount(selectedStore!)} items)
                </Text>
                <Text className="text-base font-semibold dark:text-white">
                  ${calculateStoreTotal(selectedStore!).toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-border/50 py-3 rounded-lg"
                onPress={() => {
                  saveStoreForLater(selectedStore!.id);
                  closeCartModal();
                }}
              >
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-base font-semibold text-center">
                  Save for Later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-foreground py-3 rounded-lg"
                onPress={openSuggestionsModal}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={suggestionsModalVisible}
        onRequestClose={closeSuggestionsModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between p-4 border-b border-border/15 dark:border-border/25">
            <View>
              <Text className="text-xl font-bold dark:text-white">
                Add More Items?
              </Text>
              <Text className="text-md text-foreground-muted dark:text-foreground-muted-dark">
                Complete your order with these popular items
              </Text>
            </View>
            <TouchableOpacity onPress={closeSuggestionsModal} className="p-2">
              <Icon
                name="x"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={suggestedItems}
            renderItem={renderSuggestedItem}
            keyExtractor={(item) => item.id}
            className="flex-1"
          />

          <View className="p-4 border-t border-border/15 dark:border-border/25">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-border/50 py-3 rounded-lg"
                onPress={noThanksAndCheckout}
              >
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-base font-semibold text-center">
                  No Thanks
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-foreground py-3 rounded-lg"
                onPress={noThanksAndCheckout}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;
