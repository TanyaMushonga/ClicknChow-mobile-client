import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { TextInput } from "react-native";
import { Product } from "@/types";
import { products } from "@/constants/products.json";

const ProductDetailScreen = () => {
  const { product: productString } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [expandedSections, setExpandedSections] = useState({
    ingredients: false,
    nutrition: false,
    instructions: false,
  });
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (productString) {
      try {
        const parsedProduct = JSON.parse(productString as string);
        setProduct(parsedProduct);
        if (parsedProduct.customizationOptions) {
          const initialOptions: any = {};
          parsedProduct.customizationOptions.forEach((option: any) => {
            if (option.type === "single" && option.options.length > 0) {
              initialOptions[option.id] = option.options[0].id;
            } else if (option.type === "multiple") {
              initialOptions[option.id] = [];
            }
          });
          setSelectedOptions(initialOptions);
        }
      } catch (error) {
        console.error("Error parsing product:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [productString]);

  interface ExpandedSections {
    ingredients: boolean;
    nutrition: boolean;
    instructions: boolean;
  }

  type Section = keyof ExpandedSections;

  const toggleSection = (section: Section) => {
    setExpandedSections((prev: ExpandedSections) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOptionSelect = (optionId: string, value: string | string[]) => {
    setSelectedOptions((prev: any) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const getAddOnsPrice = () => {
    if (!product?.customizationOptions) return 0;

    const addOnsOption = product.customizationOptions.find(
      (opt) =>
        opt.title.toLowerCase().includes("add") || opt.type === "multiple"
    );

    if (!addOnsOption) return 0;

    return addOnsOption.options
      .filter((addOn) => selectedOptions[addOnsOption.id]?.includes(addOn.id))
      .reduce((sum, addOn) => sum + (addOn.price || 0), 0);
  };

  const getTotalPrice = () => {
    if (!product) return 0;

    const basePrice = product.priceUSD || product.priceUSD || 0;
    const addOnsPrice = getAddOnsPrice();
    return (basePrice + addOnsPrice) * quantity;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark p-4">
        <View className="flex-row justify-between items-center mb-6">
          <View className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <View className="flex-row gap-4">
            <View className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <View className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </View>
        </View>

        <View className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <View className="flex-row justify-between mb-4">
          <View className="w-3/5 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          <View className="w-1/5 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </View>
        <View className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <View className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
        <View className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <View className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
        <View className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
        <View className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4">
          <View className="w-full h-14 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-lg text-foreground dark:text-foreground-dark">
          Product not found
        </Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-primary rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar barStyle="light-content" />
      <View className="flex flex-row items-center justify-between px-6 py-4 mt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <View className="flex flex-row gap-6 items-center">
          <TouchableOpacity>
            <MaterialIcons
              name="favorite-border"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome5
              name="share"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="mb-36">
        <Image
          source={{ uri: product.imageUrls?.[0] || product.image }}
          className="w-full h-64 object-cover"
        />

        <View className="">
          <View className="flex-row justify-between items-start mb-1 p-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </Text>
            <View className="items-end">
              <Text className="text-xl font-bold text-foreground-muted dark:text-foreground-muted-dark">
                ${(product.priceUSD || product.priceUSD).toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text className="text-sm line-through text-foreground-muted dark:text-foreground-muted-dark">
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center mb-3 px-4">
            <Ionicons name="star" size={16} color="#facc15" />
            <Text className="ml-1  dark:text-white text-lg">
              {product.ratings || product.ratings?.split(" ")[0]}
              {product.reviewCount && ` (${product.reviewCount}+ reviews)`}
            </Text>
            {product.stock && product.stock < 10 && (
              <View className="bg-primary/15 py-1 px-2 rounded-full ml-4">
                <Text className="text-primary text-sm font-medium">
                  Only {product.stock} left!
                </Text>
              </View>
            )}
          </View>

          <Text className="text-foreground-muted dark:text-foreground-muted-dark mb-2 text-lg px-4">
            {product.description}
          </Text>
          {product.badge && (
            <View className="bg-neutral/20 dark:bg-neutral p-1 mb-5 ms-4 rounded ml-2 self-start">
              <Text className="text-sm font-medium text-foreground-muted dark:text-foreground-muted-dark">
                {product.badge}
              </Text>
            </View>
          )}

          {product?.customizationOptions?.length &&
          product.customizationOptions.length > 0
            ? product.customizationOptions.map((option) => (
                <View key={option.id} className="mb-6">
                  <Text className="text-xl font-semibold dark:text-white mb-2 px-4">
                    {option.title}
                  </Text>

                  {option.type === "single"
                    ? option.options.map((opt) => (
                        <TouchableOpacity
                          key={opt.id}
                          className="border-b border-b-border/15 dark:border-b-border-dark/15 py-4"
                          onPress={() => handleOptionSelect(option.id, opt.id)}
                        >
                          <View className="flex flex-row px-4 items-center justify-between">
                            <View className="flex-row items-center">
                              <View
                                className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                                style={{
                                  borderColor:
                                    selectedOptions[option.id] === opt.id
                                      ? "#ff5a3c"
                                      : "#d1d5db",
                                  backgroundColor:
                                    selectedOptions[option.id] === opt.id
                                      ? "#ff5a3c"
                                      : "transparent",
                                }}
                              >
                                {selectedOptions[option.id] === opt.id && (
                                  <View className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </View>
                              <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                                {opt.name}
                              </Text>
                            </View>
                            <Text className="text-foreground-muted dark:text-foreground-muted-dark font-medium text-lg">
                              {opt.price > 0 && ` +$${opt.price.toFixed(2)}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    : option.options.map((opt) => (
                        <TouchableOpacity
                          key={opt.id}
                          className="border-b border-b-border/15 dark:border-b-border-dark/15 py-4"
                          onPress={() => {
                            const currentValues =
                              selectedOptions[option.id] || [];
                            const newValues = currentValues.includes(opt.id)
                              ? currentValues.filter(
                                  (id: string) => id !== opt.id
                                )
                              : [...currentValues, opt.id];
                            handleOptionSelect(option.id, newValues);
                          }}
                        >
                          <View className="flex flex-row justify-between px-4 items-center">
                            <View className="flex-row items-center">
                              <View
                                className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                                  selectedOptions[option.id]?.includes(opt.id)
                                    ? "bg-primary"
                                    : "border-2 border-border"
                                }`}
                              >
                                {selectedOptions[option.id]?.includes(
                                  opt.id
                                ) && (
                                  <AntDesign
                                    name="check"
                                    size={14}
                                    color="white"
                                  />
                                )}
                              </View>
                              <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                                {opt.name}
                              </Text>
                            </View>
                            {opt.price > 0 && (
                              <Text className="text-foreground-muted dark:text-foreground-muted-dark font-medium text-lg">
                                + ${opt.price.toFixed(2)}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                </View>
              ))
            : null}

          <View className="mb-8 rounded-lg overflow-hidden mx-4">
            <Text className="text-xl font-semibold dark:text-white">
              Special Instructions
            </Text>
            <TextInput
              className="bg-neutral/10 dark:bg-foreground/25 rounded-lg p-3 mt-2 text-gray-800 dark:text-gray-200"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="e.g., No salt, extra crispy, well done..."
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              multiline={true}
              numberOfLines={6}
              style={{ minHeight: 120 }}
              textAlignVertical="top"
            />
          </View>
          {product.ingredients && (
            <View className="mb-6 border border-border/20 rounded-lg overflow-hidden mx-4">
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-800"
                onPress={() => toggleSection("ingredients")}
              >
                <Text className="text-lg font-semibold dark:text-white">
                  Ingredients
                </Text>
                {expandedSections.ingredients ? (
                  <ChevronUp
                    size={20}
                    color={colorScheme === "dark" ? "white" : "#6b7280"}
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    color={colorScheme === "dark" ? "white" : "#6b7280"}
                  />
                )}
              </TouchableOpacity>

              {expandedSections.ingredients && (
                <View className="p-4">
                  <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md">
                    {product.ingredients.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {product.nutritionalInfo && (
            <View className="mb-6 border border-border/20 rounded-lg overflow-hidden mx-4">
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-800"
                onPress={() => toggleSection("nutrition")}
              >
                <Text className="text-lg font-semibold  dark:text-white">
                  Nutritional Information
                </Text>
                {expandedSections.nutrition ? (
                  <ChevronUp
                    size={20}
                    color={colorScheme === "dark" ? "white" : "#6b7280"}
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    color={colorScheme === "dark" ? "white" : "#6b7280"}
                  />
                )}
              </TouchableOpacity>

              {expandedSections.nutrition && (
                <View className="p-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-foreground-muted dark:text-foreground-muted-dark">
                      Calories
                    </Text>
                    <Text className="font-medium dark:text-white">
                      {product.nutritionalInfo.calories.value}
                      {product.nutritionalInfo.calories.unit}
                    </Text>
                  </View>
                  {product.nutritionalInfo.macronutrients.map((nutrient) => (
                    <View
                      key={nutrient.name}
                      className="flex-row justify-between mb-2"
                    >
                      <Text className="text-foreground-muted dark:text-foreground-muted-dark">
                        {nutrient.name}
                      </Text>
                      <Text className="font-medium dark:text-white">
                        {nutrient.value}
                        {nutrient.unit}
                        {nutrient.dailyValue && ` (${nutrient.dailyValue})`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        <View>
          <Text className="text-xl font-semibold  dark:text-white mx-4">
            Frequently bought together
          </Text>
          {products.map((product, index) => (
            <TouchableOpacity
              className={`${
                index === products.length - 1
                  ? "border-b-2 border-b-border/15 dark:border-b-border-dark/15 pb-4"
                  : "border-b border-b-border/15 dark:border-b-border-dark/15 pb-4"
              }`}
              key={product.id}
              onPress={() =>
                router.push({
                  pathname: "/product",
                  params: {
                    product: JSON.stringify(product),
                  },
                })
              }
            >
              <View className="flex flex-row flex-1 gap-4 pt-2 px-4">
                <View className="flex flex-col w-2/3 gap-1">
                  <Text className="text-lg font-semibold  dark:text-white">
                    {product.name}
                  </Text>
                  <View>
                    <View className="flex flex-row gap-3">
                      <Text className="text-md font-medium text-foreground-muted dark:text-foreground-muted-dark">
                        ${product.priceUSD}
                      </Text>
                      <Text className="text-green-600 text-md text-foreground-muted dark:text-foreground-muted-dark">
                        ✔ {product.ratings}
                      </Text>
                    </View>
                    <Text className="text-lg font-thin text-foreground-muted dark:text-foreground-muted-dark line-clamp-2">
                      {product.description}
                    </Text>
                  </View>
                  {product.badge && product.badge.length > 0 && (
                    <Text className="text-primary">{product.badge}</Text>
                  )}
                </View>
                <View
                  className={`flex flex-1 items-center justify-center relative`}
                >
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      resizeMode="cover"
                      style={{ width: 100, height: 100 }}
                      className="rounded-md"
                    />
                  ) : null}
                  <TouchableOpacity className="bg-foreground dark:bg-white rounded-full p-2 w-12 items-center h-12 absolute right-2 bottom-1 shadow-white shadow-xl">
                    <Ionicons
                      name="bag-add-outline"
                      size={24}
                      color={colorScheme === "dark" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#161515] border-t-2 border-border/20 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-medium text-xl dark:text-white">Quantity</Text>
          <View className="flex-row items-center border border-border/20 rounded-lg overflow-hidden">
            <TouchableOpacity
              className="px-4 py-2"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text className="text-3xl font-bold text-foreground-muted dark:text-foreground-muted-dark">
                -
              </Text>
            </TouchableOpacity>
            <Text className="px-4 py-2 text-lg dark:text-foreground-muted-dark font-medium">
              {quantity}
            </Text>
            <TouchableOpacity
              className="px-4 py-2"
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text className="text-3xl font-bold text-foreground-muted dark:text-foreground-muted-dark">
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          className="bg-foreground dark:bg-foreground py-3 rounded-lg items-center"
          onPress={() => {
            console.log({
              productId: product.id,
              quantity,
              options: selectedOptions,
              specialInstructions,
            });
          }}
        >
          <Text className="text-white font-bold text-lg">
            Add to Cart - ${getTotalPrice().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
