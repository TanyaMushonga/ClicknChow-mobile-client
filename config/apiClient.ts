import { getRefreshToken, refreshAccessToken } from "@/utils/token_storage";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { router } from "expo-router";

interface CreateServerApiClientOptions {
  access?: string;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function createServerApiClient(
  options: CreateServerApiClientOptions = {}
): AxiosInstance {
  const { access } = options;

  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL!,
    timeout: 10000,
    headers: {
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    maxBodyLength: 10485760,
  });

  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      delete config.headers?.["Content-Type"];
    } else {
      if (config.headers) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push((newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(instance(originalRequest));
            });
          });
        }
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            router.replace("/login");
            return Promise.reject(error);
          }

          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            router.replace("/login");
            return Promise.reject(error);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = [];

          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          router.replace("/login");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return handleServerApiError(error);
    }
  );

  return instance;
}

function handleServerApiError(error: ApiError): never {
  if (error.response) {
    const errorData: ErrorResponseData = error.response.data;

    let errorMessage = "An error occurred";

    if (typeof errorData === "string") {
      errorMessage = errorData;
    } else if (errorData.detail) {
      errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : "An error occurred";
    } else if (errorData.message) {
      errorMessage =
        typeof errorData.message === "string"
          ? errorData.message
          : JSON.stringify(errorData.message);
    } else if (errorData.error) {
      errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : JSON.stringify(errorData.error);
    } else {
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

    console.error("Server API Error:", errorMessage);
    throw new CustomApiError(errorMessage, error.response.status, errorData);
  } else if (error.request) {
    console.error("No response received:", error.request);
    throw new CustomApiError("Network error - no response from server");
  } else {
    console.error("Request error:", error.message);
    throw new CustomApiError("Error setting up the request");
  }
}

interface ApiError {
  response?: {
    data: ErrorResponseData;
    status: number;
  };
  request?: unknown;
  message: string;
  config: unknown;
}

interface ErrorResponseData {
  [key: string]: unknown;
}

class CustomApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiGet<T = unknown>(
  url: string,
  options: CreateServerApiClientOptions = {},
  config: AxiosRequestConfig = {}
): Promise<T> {
  const client = createServerApiClient(options);
  const response = await client.get<{ data: T }>(url, config);
  return ("data" in response.data ? response.data.data : response.data) as T;
}

export async function apiPost<T = unknown>(
  url: string,
  data?: unknown,
  options: CreateServerApiClientOptions = {},
  config: AxiosRequestConfig = {}
): Promise<T> {
  const client = createServerApiClient(options);
  const response = await client.post<{ data: T }>(url, data, config);
  return ("data" in response.data ? response.data.data : response.data) as T;
}

export async function apiPut<T = unknown>(
  url: string,
  data?: unknown,
  options: CreateServerApiClientOptions = {},
  config: AxiosRequestConfig = {}
): Promise<T> {
  const client = createServerApiClient(options);
  const response = await client.put<{ data: T }>(url, data, config);
  return ("data" in response.data ? response.data.data : response.data) as T;
}

export async function apiDelete<T = unknown>(
  url: string,
  options: CreateServerApiClientOptions = {},
  config: AxiosRequestConfig = {}
): Promise<T> {
  const client = createServerApiClient(options);
  const response = await client.delete<{ data: T }>(url, config);
  return ("data" in response.data ? response.data.data : response.data) as T;
}
