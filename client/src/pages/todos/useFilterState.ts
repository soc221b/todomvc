import { ref, onBeforeUnmount, onMounted } from "vue";

import type { Filter } from "../../types";

const filters = <{ label: string; value: Filter }[]>[
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export const useFilterState = () => {
  const filterState = ref<Filter>("all");

  onMounted(() => {
    syncFilter();
    window.addEventListener("hashchange", syncFilter);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("hashchange", syncFilter);
  });
  const syncFilter = () => {
    const currentHash = location.hash.slice(1);
    if (filters.some(({ value }) => value === currentHash)) {
      filterState.value = currentHash as Filter;
    } else {
      location.hash = filterState.value;
    }
  };

  return { filterState, filters } as const;
};
