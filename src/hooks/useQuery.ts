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

  // Get a specific query parameter
  const getQuery = useCallback(
    (key: string): string | null => {
      const params = new URLSearchParams(searchParams);
      return params.get(key);
    },
    [searchParams]
  );

  // Get all query parameters as an object
  const getAllQueries = useCallback((): Record<string, string> => {
    return queryParams;
  }, [queryParams]);

  // Set a single query parameter (replaces existing value)
  const setQuery = useCallback(
    (key: string, value: string, replace = false) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      updateURL(params.toString(), replace);
    },
    [searchParams, updateURL]
  );

  // Set multiple query parameters at once
  const setQueries = useCallback(
    (queries: Record<string, string>, replace = false) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(queries).forEach(([key, value]) => {
        params.set(key, value);
      });

      updateURL(params.toString(), replace);
    },
    [searchParams, updateURL]
  );

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

  // Delete a single query parameter
  const deleteQuery = useCallback(
    (key: string, replace = false) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      updateURL(params.toString(), replace);
    },
    [searchParams, updateURL]
  );

  // Delete multiple query parameters
  const deleteQueries = useCallback(
    (keys: string[], replace = false) => {
      const params = new URLSearchParams(searchParams);

      keys.forEach((key) => {
        params.delete(key);
      });

      updateURL(params.toString(), replace);
    },
    [searchParams, updateURL]
  );

  // Clear all query parameters
  const clearQueries = useCallback(
    (replace = false) => {
      updateURL("", replace);
    },
    [updateURL]
  );

  // Check if a query parameter exists
  const hasQuery = useCallback(
    (key: string): boolean => {
      const params = new URLSearchParams(searchParams);
      return params.has(key);
    },
    [searchParams]
  );

  // Replace all query parameters (clears existing and sets new ones)
  const replaceQueries = useCallback(
    (queries: Record<string, string>, replace = false) => {
      const params = new URLSearchParams();

      Object.entries(queries).forEach(([key, value]) => {
        params.set(key, value);
      });

      updateURL(params.toString(), replace);
    },
    [updateURL]
  );

  return {
    // Current query parameters as object
    queryParams,

    // Get methods
    getQuery,
    getAllQueries,
    hasQuery,

    // Set methods
    setQuery,
    setQueries,

    // Update methods
    updateQueries,

    // Delete methods
    deleteQuery,
    deleteQueries,
    clearQueries,

    // Replace methods
    replaceQueries,
  };
};
