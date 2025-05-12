import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const banners: {
  id: string;
  title: string;
  subtitle: string;
  button: string;
  colors: readonly [string, string];
}[] = [
  {
    id: "1",
    title: "30% OFF YOUR FIRST ORDER",
    subtitle: "Use code: WELCOME30",
    button: "Order Now",
    colors: ["#df4124", "#ff6b4a"],
  },
  {
    id: "2",
    title: "Free Delivery Over $15",
    subtitle: "Today only",
    button: "Shop Now",
    colors: ["#df4124", "#ff6b4a"],
  },
  {
    id: "3",
    title: "Get $5 Cashback",
    subtitle: "On all drinks",
    button: "Grab Deal",
    colors: ["#df4124", "#ff6b4a"],
  },
];

const BANNER_WIDTH = width - 20;

const Banner = () => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }: { item: (typeof banners)[0] }) => (
    <View style={[styles.bannerContainer, { width: BANNER_WIDTH }]}>
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{item.button}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        getItemLayout={(data, index) => ({
          length: BANNER_WIDTH,
          offset: BANNER_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: currentIndex,
              animated: true,
            });
          }, 100);
        }}
      />
      <View style={styles.pagination}>
        {banners.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: width - 32,
    paddingEnd: 5,
  },
  banner: {
    borderRadius: 12,
    padding: 20,
    width: "100%",
    height: 160,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 14,
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    right: 20,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
});

export default Banner;
