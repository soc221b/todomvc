import { useState, useEffect } from "react";

import type { Filter } from "../../types";

const filters = <{ label: string; value: Filter }[]>[
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export const useFilterState = () => {
  const [filterState, setFilterState] = useState<Filter>("all");

  useEffect(() => {
    syncFilter();
    window.addEventListener("hashchange", syncFilter);
    return () => {
      window.removeEventListener("hashchange", syncFilter);
    }
  }, []);
  const syncFilter = () => {
    const currentHash = location.hash.slice(1);
    if (filters.some(({ value }) => value === currentHash)) {
      setFilterState(currentHash as Filter);
    } else {
      location.hash = filterState;
    }
  };

  return { filterState, filters } as const;
};
