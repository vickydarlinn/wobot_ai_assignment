import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse } from "../types";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
const AUTH_TOKEN = "4ApVMIn5sTxeW7GQ5VWeWiy";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});

const requestWrapper = async <T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    const payload = response.data;

    return {
      status: payload?.status ?? response.status,
      message: payload?.message ?? "",
      data: payload?.data as T,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const data = error?.response?.data ?? null;
    const message = data?.message || error?.message || "Request failed";
    throw new Error(message);
  }
};

const createApiClient = (instance: AxiosInstance) => {
  const call = <T, D = unknown>(
    method: string,
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) => {
    return requestWrapper<T>(
      instance.request<ApiResponse<T>, AxiosResponse<ApiResponse<T>>>({
        method,
        url,
        data,
        ...config,
      })
    );
  };

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      call<T>("get", url, undefined, config),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      call<T>("delete", url, undefined, config),

    post: <T, D>(url: string, body?: D, config?: AxiosRequestConfig<D>) =>
      call<T, D>("post", url, body, config),

    patch: <T, D>(url: string, body?: D, config?: AxiosRequestConfig<D>) =>
      call<T, D>("patch", url, body, config),

    put: <T, D>(url: string, body?: D, config?: AxiosRequestConfig<D>) =>
      call<T, D>("put", url, body, config),
  };
};

const apiClient = createApiClient(axiosInstance);

export { axiosInstance };
export default apiClient;
