import { DEFAULT_PAGE } from "@/lib/constants";
import { useEffect, useState } from "react";

type UseEntitySearchProps<T extends { search: string; page: number }> = {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
};

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: DEFAULT_PAGE,
        });
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localSearch, debounceMs, params, setParams]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
