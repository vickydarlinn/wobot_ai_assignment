import type { AxiosRequestConfig } from "axios";

export type ApiClient = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<ApiResult<T>>;
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<ApiResult<T>>;
  post: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) => Promise<ApiResult<T>>;
  patch: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) => Promise<ApiResult<T>>;
  put: <T = unknown, D = unknown>(
    url: string,
    body?: D,
    config?: AxiosRequestConfig<D>
  ) => Promise<ApiResult<T>>;
};

export type ApiResponse<T = unknown> = {
  status: number;
  message?: string;
  data?: T;
};

export type ApiResult<T = unknown> = {
  status: number;
  message: string;
  data: T;
};

export interface UpdateStatusPayload {
  id: number;
  status: "Active" | "Inactive";
}
