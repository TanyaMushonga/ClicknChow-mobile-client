import { tokenStorage } from "@/services/storageService";
import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "./environments";

/**
 * Create Axios instance
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Custom error class for API errors
 */
class CustomApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "CustomApiError";
  }
}

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use(
  async (config) => {
    if (tokenStorage) {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Dynamically set Content-Type
    if (config.data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      tokenStorage
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        await tokenStorage.setAccessToken(newAccessToken);
        if (refreshResponse.data.refresh) {
          await tokenStorage.setRefreshToken(refreshResponse.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await tokenStorage.removeTokens();
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return handleApiError(error);
  }
);

/**
 * Handle logout - customize this based on your app's navigation
 */
async function handleLogout() {
  // Implement your logout logic here
  // For React Native, you might use navigation to go to login screen
  // For example: navigationRef.current?.navigate('Login');
  console.log("User logged out - redirect to login");
}

/**
 * Handle API errors
 */
function handleApiError(error: ApiError): never {
  if (error.response) {
    const errorData: ErrorResponseData = error.response.data;

    let errorMessage = "An error occurred"; // Default message

    if (typeof errorData === "string") {
      errorMessage = errorData;
    } else if (errorData.detail) {
      errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : "An error occurred";
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else {
      // Handle field validation errors
      const fieldErrors = Object.entries(errorData)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(", ")}`;
          } else if (typeof messages === "string") {
            return `${field}: ${messages}`;
          }
          return null;
        })
        .filter((msg) => msg !== null)
        .join(" | ");

      if (fieldErrors) {
        errorMessage = fieldErrors;
      }
    }

    console.error("API Error:", errorMessage);
    throw new CustomApiError(errorMessage, error.response.status, errorData);
  } else if (error.request) {
    console.error("No response received:", error.request);
    throw new CustomApiError("Network error - no response from server");
  } else {
    console.error("Request error:", error.message);
    throw new CustomApiError("Error setting up the request");
  }
}

/**
 * Interfaces
 */
interface ApiError {
  response?: {
    data: ErrorResponseData;
    status: number;
  };
  request?: unknown;
  message: string;
  config: AxiosRequestConfig;
}

interface ErrorResponseData {
  message?: string;
  error?: string;
  detail?: string | unknown;
  [key: string]: unknown;
}

/**
 * Utility functions for making API requests
 */
export async function apiClientGet<T>(
  url: string,
  config?: AxiosRequestConfig
) {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function apiClientPost<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function apiClientPut<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
) {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function apiClientDelete<T>(
  url: string,
  config?: AxiosRequestConfig
) {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

/**
 * Authentication helper functions
 */
export async function login(accessToken: string, refreshToken: string) {
  if (tokenStorage) {
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);
  }
}

export async function logout() {
  if (tokenStorage) {
    await tokenStorage.removeTokens();
  }
  await handleLogout();
}

export async function isAuthenticated(): Promise<boolean> {
  if (!tokenStorage) return false;
  const token = await tokenStorage.getAccessToken();
  return !!token;
}

export default apiClient;
