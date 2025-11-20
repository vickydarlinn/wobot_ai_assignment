import type { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, Camera, UpdateStatusPayload } from "../types";
import apiClient from "./client";

export const fetchAllCameras = (
  config?: AxiosRequestConfig
): Promise<ApiResponse<Camera[]>> =>
  apiClient.get<Camera[]>(API_ENDPOINTS.GET_ALL_CAMERAS, config);

export const updateCameraStatus = (
  payload: UpdateStatusPayload
): Promise<ApiResponse<Camera>> =>
  apiClient.put(API_ENDPOINTS.UPDATE_CAMERA_STATUS, payload);
