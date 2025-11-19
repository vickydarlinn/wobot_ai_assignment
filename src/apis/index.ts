import type { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../constants";
import type { ApiResult, Camera, UpdateStatusPayload } from "../types";
import apiClient from "./client";

export const fetchAllCameras = (
  config?: AxiosRequestConfig
): Promise<ApiResult<Camera[]>> =>
  apiClient.get<Camera[]>(API_ENDPOINTS.GET_ALL_CAMERAS, config);

export const updateCameraStatus = (
  payload: UpdateStatusPayload
): Promise<ApiResult<Camera>> =>
  apiClient.put(API_ENDPOINTS.UPDATE_CAMERA_STATUS, payload);
