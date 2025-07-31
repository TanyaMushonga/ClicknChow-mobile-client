import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Menu } from "@/types";
import { useRouter } from "expo-router";

const ProductsMenu = ({ menu }: { menu: Menu }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <View className="flex-1 flex-col gap-10">
      {menu.categories.map((category) => (
        <View className="" key={category.id}>
          <Text className="text-2xl font-extrabold  dark:text-white px-4">
            {category.name}
          </Text>
          <View>
            {category.products.map((product, index) => (
              <TouchableOpacity
                className={`${
                  index === category.products.length - 1
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
                <View className="flex flex-row flex-1 gap-4 p-4">
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
        </View>
      ))}
    </View>
  );
};

export default ProductsMenu;
