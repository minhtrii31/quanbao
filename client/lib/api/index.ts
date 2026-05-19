import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type ApiRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

export const AUTH_EXPIRED_EVENT = "quanbao:auth-expired";

// API base URL
const localHostnames = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

  if (process.env.NODE_ENV !== "production") {
    return (configuredUrl || "http://localhost:5000/api").replace(/\/$/, "");
  }

  if (!configuredUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is required in production");
  }

  const url = new URL(configuredUrl);

  if (url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_URL must use https in production");
  }

  if (localHostnames.has(url.hostname)) {
    throw new Error("NEXT_PUBLIC_API_URL must not use localhost in production");
  }

  if (url.pathname !== "/api" || url.search || url.hash || configuredUrl.endsWith("/")) {
    throw new Error("NEXT_PUBLIC_API_URL must be the exact public API origin plus /api");
  }

  return configuredUrl;
};

const API_BASE_URL = getApiBaseUrl();

const isProtectedApiRequest = (url?: string): boolean => {
  if (!url) return false;

  try {
    const pathname = new URL(url, API_BASE_URL).pathname.replace(/^\/api/, "");
    return (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth/me") ||
      pathname.startsWith("/auth/logout") ||
      pathname.startsWith("/stats")
    );
  } catch {
    return false;
  }
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor kept for local/dev fallback only.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const requestConfig = error.config as ApiRequestConfig | undefined;
      const shouldSkipAuthRedirect = requestConfig?.skipAuthRedirect;
      const isProtectedRequest = isProtectedApiRequest(requestConfig?.url);

      if (error.response.status === 401 && !shouldSkipAuthRedirect && isProtectedRequest) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
        }
      }

    }

    return Promise.reject(error);
  },
);

// Generic API methods
export const apiRequest = {
  get: <T>(url: string, config?: ApiRequestConfig) => api.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    api.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    api.put<T>(url, data, config),
  delete: <T>(url: string, config?: ApiRequestConfig) =>
    api.delete<T>(url, config),
  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    api.patch<T>(url, data, config),
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Thao tác thất bại",
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { message?: string }[] } | undefined;
    return data?.message || data?.errors?.[0]?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const isRequestCanceled = (error: unknown): boolean => axios.isCancel(error);

export default api;
