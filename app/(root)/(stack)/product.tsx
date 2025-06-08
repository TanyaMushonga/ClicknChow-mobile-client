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
            <Text className="ml-1 text-gray-700">
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

          <Text className="text-gray-600 mb-6">{product.description}</Text>

          <Text className="text-lg font-bold text-gray-900 mb-4">
            Customize Your Order
          </Text>

          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.sauces.title}
            </Text>
            {product.customizationOptions.sauces.options.map((sauce) => (
              <TouchableOpacity
                key={sauce.id}
                className="flex-row items-center py-2"
                onPress={() =>
                  setSelectedOptions({ ...selectedOptions, sauce: sauce.id })
                }
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedOptions.sauce === sauce.id
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOptions.sauce === sauce.id && (
                    <View className="w-3 h-3 rounded-full bg-green-500" />
                  )}
                </View>
                {/* Sauce Name */}
                <Text className="text-gray-700">{sauce.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add-Ons */}
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.addOns.title}
            </Text>
            {product.customizationOptions.addOns.options.map((addOn) => (
              <TouchableOpacity
                key={addOn.id}
                className="flex-row justify-between items-center py-2"
                onPress={() => {
                  const newAddOns = selectedOptions.addOns.includes(addOn.id)
                    ? selectedOptions.addOns.filter((id) => id !== addOn.id)
                    : [...selectedOptions.addOns, addOn.id];
                  setSelectedOptions({ ...selectedOptions, addOns: newAddOns });
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-5 h-5 border-2 rounded mr-3 
                  ${
                    selectedOptions.addOns.includes(addOn.id)
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                  />
                  <Text className="text-gray-700">{addOn.name}</Text>
                </View>
                <Text className="text-gray-500">
                  + ${addOn.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Remove Ingredients */}
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.removables.title}
            </Text>
            {product.customizationOptions.removables.options.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center py-2"
                onPress={() => {
                  const newRemovals = selectedOptions.removables.includes(
                    item.id
                  )
                    ? selectedOptions.removables.filter((id) => id !== item.id)
                    : [...selectedOptions.removables, item.id];
                  setSelectedOptions({
                    ...selectedOptions,
                    removables: newRemovals,
                  });
                }}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 
                ${
                  selectedOptions.removables.includes(item.id)
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
                />
                <Text className="text-gray-700">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Portion Size */}
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">
              {product.customizationOptions.portionSize.title}
            </Text>
            {product.customizationOptions.portionSize.options.map((size) => (
              <TouchableOpacity
                key={size.id}
                className="flex-row items-center py-2"
                onPress={() =>
                  setSelectedOptions({
                    ...selectedOptions,
                    portionSize: size.id,
                  })
                }
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 
                ${
                  selectedOptions.portionSize === size.id
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
                />
                <Text className="text-gray-700">
                  {size.name}{" "}
                  {size.price > 0 ? `(+$${size.price.toFixed(2)})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ingredients & Nutrition */}
          <View className="mb-6">
            <Text className="font-medium text-gray-800 mb-2">Ingredients</Text>
            <Text className="text-gray-600 mb-4">
              {product.ingredients.join(", ")}
            </Text>

            <Text className="font-medium text-gray-800 mb-2">
              Nutritional Information
            </Text>
            <Text className="text-gray-600">
              Calories: {product.nutritionalInfo.calories}kcal | Protein:{" "}
              {product.nutritionalInfo.protein}
            </Text>
          </View>

          {/* Special Instructions */}
          <View className="mb-8">
            <Text className="font-medium text-gray-800 mb-2">
              Special Instructions
            </Text>
            <View className="border border-gray-300 rounded-lg p-3">
              <Text className="text-gray-400">
                e.g., No salt, extra crispy, well done...
              </Text>
            </View>
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
