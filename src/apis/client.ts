import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiClient, ApiResponse, ApiResult } from "../types";

const baseURL = import.meta.env.API_BASE_URL;
const AUTH_TOKEN = "4ApVMIn5sTxeW7GQ5VWeWiy";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const requestInterceptor = (request: InternalAxiosRequestConfig) => {
  return request;
};

const requestErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(error);
};

const responseInterceptor = <T>(response: AxiosResponse<T>) => {
  return response;
};

const responseErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);
axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

const requestWrapper = async <T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResult<T>> => {
  const response = await request;
  const payload = response.data;

  const statusCode = payload?.status ?? response.status;
  const message = payload?.message ?? "";

  if (statusCode >= 400) {
    throw new ApiError(message || "Request failed", statusCode, payload?.data);
  }

  return {
    status: statusCode,
    message,
    data: (payload?.data as T) ?? (null as T),
  };
};

const createApiClient = (instance: AxiosInstance): ApiClient => ({
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    requestWrapper<T>(instance.get<ApiResponse<T>>(url, config)),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    requestWrapper<T>(instance.delete<ApiResponse<T>>(url, config)),
  post: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    requestWrapper<T>(
      instance.post<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(
        url,
        body,
        config
      )
    ),
  patch: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    requestWrapper<T>(
      instance.patch<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(
        url,
        body,
        config
      )
    ),
  put: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    requestWrapper<T>(
      instance.put<ApiResponse<T>, AxiosResponse<ApiResponse<T>>, D>(
        url,
        body,
        config
      )
    ),
});

const apiClient = createApiClient(axiosInstance);

export { ApiError, axiosInstance };
export default apiClient;
