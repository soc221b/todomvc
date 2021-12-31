import { createSignal, onMount, onCleanup } from "solid-js";

import type { Filter } from "../../types";

const filters = <{ label: string; value: Filter }[]>[
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export const useFilterState = () => {
  const [filterState, setFilterState] = createSignal<Filter>("all");

  onMount(() => {
    syncFilter();
    window.addEventListener("hashchange", syncFilter);
  });
  onCleanup(() => {
    window.removeEventListener("hashchange", syncFilter);
  });
  const syncFilter = () => {
    const currentHash = location.hash.slice(1);
    if (filters.some(({ value }) => value === currentHash)) {
      setFilterState(currentHash as Filter);
    } else {
      location.hash = filterState();
    }
  };

  return { filterState, filters } as const;
};
