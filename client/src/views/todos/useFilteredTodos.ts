import { computed } from "vue";

import type { DeepReadonly, Ref } from "vue";
import type { Filter, Todo } from "../../types";

const doFilter = (todos: DeepReadonly<Todo[]>, filter: Filter) => {
  switch (filter) {
    case "active":
      return todos.filter((todo) => todo.completed === false);

    case "completed":
      return todos.filter((todo) => todo.completed);

    case "all":
    default:
      return todos;
  }
};

export const useFilteredTodos = ({
  filterState,
  todos,
}: {
  filterState: Ref<Filter>;
  todos: Ref<DeepReadonly<Todo[]>>;
}) => {
  const filteredTodos = computed(() =>
    doFilter(todos.value, filterState.value)
  );

  const activeTodos = computed(() => doFilter(filteredTodos.value, "active"));
  const activeTodoCount = computed(() => activeTodos.value.length);
  const activeSuffixText = computed(() =>
    activeTodoCount.value === 1 ? "item left" : "items left"
  );

  const completedTodos = computed(() =>
    doFilter(filteredTodos.value, "completed")
  );
  const areTodosCompleted = computed(
    () => filteredTodos.value.length === completedTodos.value.length
  );

  return {
    filteredTodos,
    activeTodoCount,
    activeSuffixText,
    completedTodos,
    areTodosCompleted,
  } as const;
};
