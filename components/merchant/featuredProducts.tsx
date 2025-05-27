import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants";

const { width } = Dimensions.get("window");

const recommendedItems = [
  {
    id: "1",
    name: "Grilled Chicken",
    restaurant: "Chicken House",
    images: [images.chicken, images.chicken2, images.chicken3],
    rating: 4.8,
    price: 9.99,
    prepTime: "15-20 min",
  },
  {
    id: "2",
    name: "Pasta Carbonara",
    restaurant: "Italian Place",
    images: [images.pasta, images.pasta2, images.pasta1],
    rating: 4.6,
    price: 11.5,
    prepTime: "20-25 min",
  },
  {
    id: "3",
    name: "Sushi Platter",
    restaurant: "Sushi World",
    images: [images.sushi, images.sushi2, images.sushi1],
    rating: 5.0,
    price: 21.5,
    prepTime: "25-30 min",
  },
];

const FeaturedProducts = () => {
  const [currentIndices, setCurrentIndices] = useState<{
    [key: string]: number;
  }>({});
  const flatListRefs = useRef<{ [key: string]: FlatList | null }>({});
  const colorScheme = useColorScheme();

  useEffect(() => {
    const indices: { [key: string]: number } = {};
    recommendedItems.forEach((item) => {
      indices[item.id] = 0;
    });
    setCurrentIndices(indices);
  }, []);

  useEffect(() => {
    const intervals = recommendedItems.map((item) => {
      return setInterval(() => {
        setCurrentIndices((prev) => {
          const nextIndex = (prev[item.id] + 1) % item.images.length;
          const flatListRef = flatListRefs.current[item.id];
          if (flatListRef) {
            flatListRef.scrollToIndex({ index: nextIndex, animated: true });
          }
          return { ...prev, [item.id]: nextIndex };
        });
      }, 3000);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const renderImageItem = ({ item }: { item: any }) => (
    <Image source={item} resizeMode="cover" style={{ width, height: 100 }} />
  );

  const renderRecommendedItem = (item: (typeof recommendedItems)[number]) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        className="bg-card dark:bg-card-dark mr-4 overflow-hidden rounded-lg w-[160px]"
      >
        <View style={{ height: 100, position: "relative" }}>
          <FlatList
            ref={(ref) => {
              flatListRefs.current[item.id] = ref;
            }}
            data={item.images}
            renderItem={renderImageItem}
            keyExtractor={(_, idx) => idx.toString()}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />

          <View className="absolute bottom-2 right-2 flex flex-row justify-center">
            {item.images.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: currentIndices[item.id] === index ? 12 : 6,
                  backgroundColor:
                    currentIndices[item.id] === index ? "#ff5a3c" : "#ffffff",
                  marginHorizontal: 4,
                  borderRadius: 4,
                }}
              />
            ))}
          </View>
        </View>

        <View className="p-2 flex flex-col gap-1 relative flex-1">
          <Text className="text-black dark:text-white font-bold text-lg">
            {item.name}
          </Text>
          <Text className="text-foreground dark:text-foreground-muted-dark text-sm">
            {item.restaurant} • {item.prepTime}
          </Text>

          <View className="flex flex-row justify-between items-center mt-3">
            <Text className="text-black dark:text-white">
              ${item.price.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity className="bg-foreground dark:bg-white rounded-full p-2 w-12 items-center h-12 absolute right-2 bottom-2 shadow-white shadow-xl">
            <Ionicons
              name="bag-add-outline"
              size={24}
              color={colorScheme === "dark" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-black dark:text-white">
          Featured items
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recommendedItems.map(renderRecommendedItem)}
      </ScrollView>
    </View>
  );
};

export default FeaturedProducts;
