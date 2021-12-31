import { Accessor, createMemo } from "solid-js";

import type { Filter, Todo } from "../../types";

const doFilter = (todos: Todo[], filter: Filter) => {
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
  filterState: Accessor<Filter>;
  todos: Accessor<Todo[]>;
}) => {
  const filteredTodos = createMemo(() => doFilter(todos(), filterState()));

  const activeTodos = createMemo(() => doFilter(filteredTodos(), "active"));
  const activeTodoCount = createMemo(() => activeTodos().length);
  const activeSuffixText = createMemo(() =>
    activeTodoCount() === 1 ? "item left" : "items left"
  );

  const completedTodos = createMemo(() =>
    doFilter(filteredTodos(), "completed")
  );
  const areTodosCompleted = createMemo(
    () => filteredTodos.length === completedTodos.length
  );

  return {
    filteredTodos,
    activeTodoCount,
    activeSuffixText,
    completedTodos,
    areTodosCompleted,
  } as const;
};
