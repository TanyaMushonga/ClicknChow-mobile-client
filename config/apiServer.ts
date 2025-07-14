import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
  field_errors?: Record<string, string[]>;
  non_field_errors?: string[];
  detail?: string;
}

interface ServerConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  apiKey?: string;
  serverToken?: string;
}

const DEFAULT_TIMEOUT = 30000;

class ApiServer {
  private client: AxiosInstance;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers["X-API-Key"] = this.config.apiKey;
        }

        if (this.config.serverToken) {
          config.headers.Authorization = `Bearer ${this.config.serverToken}`;
        }

        config.headers["X-Server-Request"] = "true";

        return config;
      },
      (error) => Promise.reject(error)
    );

     this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const response = error.response;

    if (!response) {
      return {
        message: "Network error. Unable to connect to the server.",
        status: 0,
      };
    }

    const data = response.data as any;
    let message = "An error occurred";
    let field_errors: Record<string, string[]> | undefined;
    let non_field_errors: string[] | undefined;

    if (data) {

      if (
        data.field_errors ||
        (typeof data === "object" && !data.detail && !data.message)
      ) {
        field_errors = data.field_errors || data;
        if (field_errors) {
          const firstFieldError = Object.values(field_errors)[0];
          if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
            message = firstFieldError[0];
          }
        }
      }

      if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        non_field_errors = data.non_field_errors;
        message = non_field_errors?.[0] || message;
      }

      if (data.detail) {
        message = data.detail;
      }
      if (data.message) {
        message = data.message;
      }
    }

    if (response.status >= 500) {
      console.error("Server Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: response.status,
        data: data,
      });
    }

    return {
      message,
      status: response.status,
      field_errors,
      non_field_errors,
      detail: data?.detail,
    };
  }

  updateConfig(newConfig: Partial<ServerConfig>): void {
    this.config = { ...this.config, ...newConfig };

    this.client.defaults.baseURL = this.config.baseURL;
    this.client.defaults.timeout = this.config.timeout || DEFAULT_TIMEOUT;

    if (this.config.headers) {
      this.client.defaults.headers = {
        ...this.client.defaults.headers,
        ...this.config.headers,
      };
    }
  }

  setServerToken(token: string): void {
    this.config.serverToken = token;
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.get("/health/");
  }

  async getServerInfo(): Promise<ApiResponse<any>> {
    return this.get("/info/");
  }
}

export const createApiServer = (config: ServerConfig): ApiServer => {
  return new ApiServer(config);
};

const defaultServerConfig: ServerConfig = {
  baseURL: process.env.EXPO_PUBLIC_BASE_URL!,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "User-Agent": "ExpoApp/1.0",
  },
};

const apiServer = new ApiServer(defaultServerConfig);

export const apiServerGet = <T = any>(
  url: string,
  config?: AxiosRequestConfig
) => apiServer.get<T>(url, config);

export const apiServerPost = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiServer.post<T>(url, data, config);

export const apiServerPut = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiServer.put<T>(url, data, config);

export const apiServerPatch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiServer.patch<T>(url, data, config);

export const apiServerDelete = <T = any>(
  url: string,
  config?: AxiosRequestConfig
) => apiServer.delete<T>(url, config);

export { ApiError, ApiResponse, ServerConfig };
export default apiServer;
