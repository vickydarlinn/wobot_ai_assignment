import { API_ENDPOINTS } from "../constants";
import type { UpdateStatusPayload } from "../types";
import apiClient from "./client";

export const fetchAllCameras = () =>
  apiClient.get(API_ENDPOINTS.GET_ALL_CAMERAS);

export const updateCameraStatus = (payload: UpdateStatusPayload) =>
  apiClient.put(API_ENDPOINTS.UPDATE_CAMERA_STATUS, payload);
