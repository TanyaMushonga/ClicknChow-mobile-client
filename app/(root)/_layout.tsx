import React, { useEffect } from "react";
import { Stack } from "expo-router";
import {
  getAccessToken,
  getRefreshToken,
  getUserData,
} from "@/utils/token_storage";
import { useIsAuthenticated } from "@/store/auth";

export default function Layout() {
  const { setIsAuthenticated, setUserData, setShowAuthModal, login } =
    useIsAuthenticated();

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const access = await getAccessToken();
        const refresh = await getRefreshToken();
        const userData = await getUserData();

        if (access && refresh && userData) {
          login(userData);
        } else {
          setIsAuthenticated(false);
          setShowAuthModal(true);
          setUserData(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setShowAuthModal(true);
        setUserData(null);
        console.error("Failed to restore authentication:", error);
      }
    };
    restoreAuth();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
