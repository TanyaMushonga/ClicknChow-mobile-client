import { View, Text, Pressable } from "react-native";
import { useState } from "react";

const modes = ["Delivery", "Pickup", "Dine-in"];

export default function DeliveryModeSelector() {
  const [selected, setSelected] = useState("Delivery");

  return (
    <View className="flex-row justify-around bg-white rounded-full p-1 border border-gray-200 mb-4">
      {modes.map((mode) => (
        <Pressable
          key={mode}
          onPress={() => setSelected(mode)}
          className={
            "flex-1 items-center py-2 rounded-full " +
            (selected === mode ? "bg-blue-600" : "bg-transparent")
          }
        >
          <Text
            className={
              "text-sm font-medium " +
              (selected === mode ? "text-white" : "text-gray-600")
            }
          >
            {mode}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
