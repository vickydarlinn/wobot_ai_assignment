import { useEffect, useState } from "react";
import { fetchAllCameras } from "../apis";
import type { Camera } from "../types";

export type UseFetchCamerasState = {
  data: Camera[];
  isLoading: boolean;
  error: string | null;
};

const useFetchCameras = (): UseFetchCamerasState => {
  const [data, setData] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCameras = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchAllCameras({ signal: controller.signal });
        if (!controller.signal.aborted) {
          setData(response?.data ?? []);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Unable to fetch camera data";
        setError(message);
        setData([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadCameras();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

export default useFetchCameras;
