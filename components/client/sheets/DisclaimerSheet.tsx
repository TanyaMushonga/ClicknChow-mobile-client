import { useBottomSheetStore } from "@/store";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";

const DisclaimerSheet = ({ onClose }: { onClose: () => void }) => {
  const [optedOut, setOptedOut] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { hideBottomSheet } = useBottomSheetStore();

  return (
    <View>
      <View className="flex flex-col gap-4 mb-6">
        <Text className=" dark:text-white text-lg font-medium">
          ClicknChow is paid by merchants, brands, and partners to advertise and
          promote their products on our app. These sponsored listings are always
          marked with a "Sponsored" or "Ad" tag for transparency.
        </Text>

        <Text className=" dark:text-white text-lg font-medium">
          To personalize your experience, ClicknChow uses your location, profile
          information, order history, and search behavior to show relevant
          sponsored content and recommendations.
        </Text>

        <Text className=" dark:text-white text-lg font-medium">
          You may see fewer personalized ads if you opt out below, but you'll
          still see general sponsored content based on your approximate
          location.
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-6">
        <Text className=" dark:text-white text-lg font-medium">
          Opt out of personalized sponsored content
        </Text>
        <Switch
          value={optedOut}
          onValueChange={setOptedOut}
          trackColor={{ false: "#d1d5db", true: "#ff5a3c" }}
          thumbColor={optedOut ? "#fff" : "#f9fafb"}
        />
      </View>

      <TouchableOpacity
        className="py-3 rounded-lg items-center bg-foreground"
        activeOpacity={0.8}
        onPress={() => {
          setConfirmed(true);
          onClose();
        }}
      >
        <Text className="text-white font-bold text-lg">
          {confirmed ? "Thank you!" : "I understand"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DisclaimerSheet;
