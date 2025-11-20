import { useCallback, useMemo, useState, useEffect } from "react";

export const useQuery = () => {
  const [searchParams, setSearchParams] = useState(
    () => window.location.search
  );

  // Listen to URL changes (for browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(window.location.search);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Parse current query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    const paramsObject: Record<string, string> = {};
    params.forEach((value, key) => {
      paramsObject[key] = value;
    });
    return paramsObject;
  }, [searchParams]);

  // Update URL and state
  const updateURL = useCallback((newSearch: string, replace = false) => {
    const url = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname;

    if (replace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }

    setSearchParams(newSearch ? `?${newSearch}` : "");
  }, []);

  // Update query parameters (merge with existing)
  const updateQueries = useCallback(
    (queries: Record<string, string | null | undefined>, replace = false) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(queries).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      updateURL(params.toString(), replace);
    },
    [searchParams, updateURL]
  );

  return {
    queryParams,
    updateQueries,
  };
};
