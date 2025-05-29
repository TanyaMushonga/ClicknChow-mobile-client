import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FeaturedProductsType } from "@/types";
import { useRouter } from "expo-router";

const FeaturedProducts = ({
  featuredProducts,
}: {
  featuredProducts: FeaturedProductsType;
}) => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const hasFeaturedProducts = featuredProducts.menu.categories.some(
    (category) => category.products.some((product) => product.isFeatured)
  );

  if (!hasFeaturedProducts) {
    return null;
  }

  return (
    <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-extrabold text-black dark:text-white">
          Featured items
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuredProducts.menu.categories.flatMap((category) =>
          category.products
            .filter((product) => product.isFeatured)
            .map((product) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/product",
                    params: {
                      product: JSON.stringify(product),
                    },
                  })
                }
                key={product.id}
                activeOpacity={0.9}
                className="bg-card dark:bg-card-dark mr-4 overflow-hidden rounded-lg w-[160px]"
              >
                <View style={{ height: 100, position: "relative" }}>
                  <Image
                    source={{ uri: product.image }}
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>

                <View className="p-2 flex flex-col gap-1 relative flex-1">
                  <Text className="text-black dark:text-white font-bold text-lg">
                    {product.name}
                  </Text>
                  <Text className="text-foreground dark:text-foreground-muted-dark text-sm">
                    {product.name} • {product.preparationTime}
                  </Text>

                  <View className="flex flex-row justify-between items-center mt-3">
                    <Text className="text-black dark:text-white">
                      ${product.priceUSD}
                    </Text>
                  </View>
                  <TouchableOpacity className="bg-foreground dark:bg-white rounded-full p-1 w-10 items-center h-10 absolute right-2 bottom-1 shadow-white shadow-xl">
                    <Ionicons
                      name="bag-add-outline"
                      size={24}
                      color={colorScheme === "dark" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
        )}
      </ScrollView>
    </View>
  );
};

export default FeaturedProducts;
