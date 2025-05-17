import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const _layout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="address" options={{ headerShown: false }} />
        <Stack.Screen
          name="search"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="storemap" options={{ headerShown: false }} />
        <Stack.Screen name="merchant" options={{ headerShown: false }} />
        <Stack.Screen name="storeinfor" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default _layout;
