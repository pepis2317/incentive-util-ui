import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public detail?: unknown // raw FastAPI detail (string, array, or object)
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// FastAPI returns `detail` as:
//  - a string for HTTPException(detail="...")
//  - an array of { loc, msg, type } for 422 validation errors
//  - any JSON value if you passed a dict to HTTPException
function extractMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const { detail, message } = data as { detail?: unknown; message?: unknown };

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const loc = Array.isArray(d?.loc) ? d.loc.slice(1).join(".") : "";
        return loc ? `${loc}: ${d?.msg}` : String(d?.msg ?? JSON.stringify(d));
      })
      .join("; ");
  }

  if (detail && typeof detail === "object") return JSON.stringify(detail);
  if (typeof message === "string") return message;

  return fallback;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

const isBrowser = typeof window !== "undefined";

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isBrowser) {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown; message?: string }>) => {
    if (error.response?.status === 401 && isBrowser) {
      window.localStorage.removeItem("token");
    }

    if (axios.isAxiosError(error)) {
      const message = extractMessage(
        error.response?.data,
        error.message ?? "Something went wrong"
      );
      return Promise.reject(
        new ApiError(message, error.response?.status, error.response?.data?.detail)
      );
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, body, config).then((res) => res.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, body, config).then((res) => res.data),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, body, config).then((res) => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};
