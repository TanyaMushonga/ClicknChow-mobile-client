import { dummyProduct } from "@/constants";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const ProductDetailScreen = () => {
  const [product] = useState(dummyProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    sauce: product.customizationOptions.sauces.options[0].id,
    addOns: [] as string[],
    removables: [] as string[],
    portionSize: product.customizationOptions.portionSize.options[0].id,
    specialInstructions: "",
  });
  const [expandedSections, setExpandedSections] = useState({
    ingredients: false,
    nutrition: false,
    instructions: false,
  });

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

  const router = useRouter();

  const getAddOnsPrice = () => {
    return product.customizationOptions.addOns.options
      .filter((addOn) => selectedOptions.addOns.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.price, 0);
  };

  const getPortionSizePrice = () => {
    const portion = product.customizationOptions.portionSize.options.find(
      (opt) => opt.id === selectedOptions.portionSize
    );
    return portion ? portion.price : 0;
  };

  const totalPrice =
    (product.price + getAddOnsPrice() + getPortionSizePrice()) * quantity;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <View className="flex flex-row items-center justify-between px-6 py-4 mt-4">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex flex-row gap-6 items-center">
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome5 name="share" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="pb-24">
        <Image
          source={{ uri: product.imageUrls[0] }}
          className="w-full h-64 object-cover"
        />

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-2xl font-bold text-gray-900">
              {product.name}
            </Text>
            <View className="items-end">
              <Text className="text-xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text className="text-sm line-through text-gray-500">
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={16} color="#facc15" />
            <Text className="ml-1 text-black dark:text-white text-lg">
              {product.rating} ({product.reviewCount}+ reviews)
            </Text>
            {product.stock < 10 && (
              <View className="bg-primary/15 py-1 px-2 rounded-full ml-4">
                <Text className="text-primary text-sm font-medium">
                  Only {product.stock} left!
                </Text>
              </View>
            )}
          </View>

          <Text className="text-foreground-muted dark:text-foreground-muted-dark mb-6 text-lg">
            {product.description}
          </Text>

          <Text className="text-xl font-bold text-black dark:text-white mb-4">
            Customize Your Order
          </Text>

          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.sauces.title}
            </Text>
            {product.customizationOptions.sauces.options.map((sauce) => (
              <TouchableOpacity
                key={sauce.id}
                className={`flex-row items-center py-2 border ${
                  selectedOptions.sauce === sauce.id
                    ? "border-primary"
                    : "border-border/20"
                } p-3 mb-4 rounded-lg`}
                onPress={() =>
                  setSelectedOptions({ ...selectedOptions, sauce: sauce.id })
                }
              >
                <View
                  className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                  style={{
                    borderColor:
                      selectedOptions.sauce === sauce.id
                        ? "#ff5a3c"
                        : "#d1d5db",
                    backgroundColor:
                      selectedOptions.sauce === sauce.id
                        ? "#ff5a3c"
                        : "transparent",
                  }}
                >
                  {selectedOptions.sauce === sauce.id && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
                <Text className="text-gray-700">{sauce.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.addOns.title}
            </Text>
            {product.customizationOptions.addOns.options.map((addOn) => (
              <TouchableOpacity
                key={addOn.id}
                className={`flex-row justify-between items-center border p-3 mb-4 rounded-lg ${
                  selectedOptions.addOns.includes(addOn.id)
                    ? "border-primary"
                    : "border-border/20"
                }`}
                onPress={() => {
                  const newAddOns = selectedOptions.addOns.includes(addOn.id)
                    ? selectedOptions.addOns.filter((id) => id !== addOn.id)
                    : [...selectedOptions.addOns, addOn.id];
                  setSelectedOptions({ ...selectedOptions, addOns: newAddOns });
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-5 h-5 rounded mr-3 flex items-center justify-center
                    ${
                      selectedOptions.addOns.includes(addOn.id)
                        ? "bg-primary"
                        : "border-2 border-border"
                    }`}
                  >
                    {selectedOptions.addOns.includes(addOn.id) && (
                      <AntDesign name="check" size={14} color="white" />
                    )}
                  </View>
                  <Text className="text-gray-700">{addOn.name}</Text>
                </View>
                <Text className="dark:text-foreground font-medium text-lg">
                  + ${addOn.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.removables.title}
            </Text>
            <ScrollView horizontal>
              {product.customizationOptions.removables.options.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center mr-4 px-3 py-2 rounded-full border ${
                    selectedOptions.removables.includes(item.id)
                      ? "bg-neutral/10 border-border/90"
                      : "border-border/30"
                  }`}
                  onPress={() => {
                    const newRemovals = selectedOptions.removables.includes(
                      item.id
                    )
                      ? selectedOptions.removables.filter(
                          (id) => id !== item.id
                        )
                      : [...selectedOptions.removables, item.id];
                    setSelectedOptions({
                      ...selectedOptions,
                      removables: newRemovals,
                    });
                  }}
                >
                  <Text
                    className={`${
                      selectedOptions.removables.includes(item.id)
                        ? "text-foreground dark:text-background"
                        : "text-foreground-muted dark:text-foreground-muted-dark"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Portion Size (Radio Buttons) */}
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.portionSize.title}
            </Text>
            {product.customizationOptions.portionSize.options.map((size) => (
              <TouchableOpacity
                key={size.id}
                className={`flex-row items-center py-2 border ${
                  selectedOptions.portionSize === size.id
                    ? "border-primary"
                    : "border-border/20"
                } p-3 mb-4 rounded-lg`}
                onPress={() =>
                  setSelectedOptions({
                    ...selectedOptions,
                    portionSize: size.id,
                  })
                }
              >
                <View
                  className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                  style={{
                    borderColor:
                      selectedOptions.portionSize === size.id
                        ? "#ff5a3c"
                        : "#d1d5db",
                    backgroundColor:
                      selectedOptions.portionSize === size.id
                        ? "#ff5a3c"
                        : "transparent",
                  }}
                >
                  {selectedOptions.portionSize === size.id && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
                <Text className="text-gray-700">
                  {size.name}{" "}
                  {size.price > 0 ? `(+$${size.price.toFixed(2)})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4 bg-gray-50"
              onPress={() => toggleSection("ingredients")}
            >
              <Text className="font-medium text-gray-800">Ingredients</Text>
              {expandedSections.ingredients ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {expandedSections.ingredients && (
              <View className="p-4">
                <Text className="text-gray-600">
                  {product.ingredients.join(", ")}
                </Text>
              </View>
            )}
          </View>

          {/* Nutritional Information Section */}
          <View className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4 bg-gray-50"
              onPress={() => toggleSection("nutrition")}
            >
              <Text className="font-medium text-gray-800">
                Nutritional Information
              </Text>
              {expandedSections.nutrition ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {expandedSections.nutrition && (
              <View className="p-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Calories</Text>
                  <Text className="font-medium">
                    {product.nutritionalInfo.calories}kcal
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Protein</Text>
                  <Text className="font-medium">
                    {product.nutritionalInfo.protein}g
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Special Instructions Section */}
          <View className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4 bg-gray-50"
              onPress={() => toggleSection("instructions")}
            >
              <Text className="font-medium text-gray-800">
                Special Instructions
              </Text>
              {expandedSections.instructions ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {expandedSections.instructions && (
              <View className="p-4">
                <View className="border border-gray-300 rounded-lg p-3">
                  <Text className="text-gray-400">
                    e.g., No salt, extra crispy, well done...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Quantity Selector & Add to Cart */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-medium text-gray-800">Quantity</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg">
            <TouchableOpacity
              className="px-4 py-2"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text className="text-xl text-gray-600">-</Text>
            </TouchableOpacity>
            <Text className="px-4 py-2 text-lg text-gray-800">{quantity}</Text>
            <TouchableOpacity
              className="px-4 py-2"
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text className="text-xl text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="bg-green-600 py-3 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">
            Add to Cart - ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
