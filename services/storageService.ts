import * as SecureStore from "expo-secure-store";

/**
 * Token storage keys
 */
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Token storage using Expo SecureStore
 */
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting access token:", error);
      throw error;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting refresh token:", error);
      throw error;
    }
  },

  async removeTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error("Error removing tokens:", error);
      throw error;
    }
  },
};
