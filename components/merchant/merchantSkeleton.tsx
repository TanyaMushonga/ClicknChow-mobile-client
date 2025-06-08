import { View, Text, StatusBar, useColorScheme, Platform } from "react-native";
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const HEADER_MAX_HEIGHT = 150;

const MerchantSkeleton = () => {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-1 bg-background dark:bg-background-dark p-4">
      <StatusBar translucent backgroundColor="transparent" />
      <SkeletonPlaceholder
        backgroundColor={colorScheme === "dark" ? "#1e293b" : "#f1f5f9"}
        highlightColor={colorScheme === "dark" ? "#334155" : "#e2e8f0"}
      >
        <View style={{ flexDirection: "column", gap: 16 }}>
          <View style={{ height: HEADER_MAX_HEIGHT, borderRadius: 8 }} />

          <View style={{ width: "70%", height: 32, borderRadius: 4 }} />

          <View style={{ width: "50%", height: 20, borderRadius: 4 }} />

          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ width: 100, height: 40, borderRadius: 20 }} />
            <View style={{ width: 100, height: 40, borderRadius: 20 }} />
            <View style={{ width: 100, height: 40, borderRadius: 20 }} />
          </View>

          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 12, marginTop: 16 }}
            >
              <View style={{ width: 100, height: 100, borderRadius: 8 }} />
              <View style={{ flex: 1 }}>
                <View style={{ width: "70%", height: 20, borderRadius: 4 }} />
                <View
                  style={{
                    width: "40%",
                    height: 16,
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                />
                <View
                  style={{
                    width: "90%",
                    height: 14,
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                />
                <View
                  style={{
                    width: "90%",
                    height: 14,
                    borderRadius: 4,
                    marginTop: 4,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export default MerchantSkeleton;
