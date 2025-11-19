import { useCallback, useState } from "react";
import { updateCameraStatus } from "../apis";
import type { UpdateStatusPayload } from "../types";

export type UseUpdateCameraStatusState = {
  isLoading: boolean;
  error: string | null;
  updateStatus: (payload: UpdateStatusPayload) => Promise<void>;
};

const useUpdateCameraStatus = (): UseUpdateCameraStatusState => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (payload: UpdateStatusPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateCameraStatus(payload);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update camera status";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    updateStatus,
  };
};

export default useUpdateCameraStatus;
