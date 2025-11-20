export type ApiResponse<T = unknown> = {
  status: number;
  message?: string;
  data?: T;
};

export interface UpdateStatusPayload {
  id: number;
  status: "Active" | "Inactive";
}

export interface Camera {
  _id: string;
  id: number;
  name: string;
  current_status: string;
  health: {
    cloud: string;
    device: string;
    _id: string;
    id: string;
  };
  location: string;
  recorder: string;
  tasks: string;
  status: "Active" | "Inactive";
  hasWarning?: boolean;
}
