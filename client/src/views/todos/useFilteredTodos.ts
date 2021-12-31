import { useMemo } from "react";

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
  filterState: Filter;
  todos: Todo[];
}) => {
  const filteredTodos = useMemo(() => doFilter(todos, filterState), [todos, filterState]);

  const activeTodos = useMemo(() => doFilter(filteredTodos, "active"), [filteredTodos]);
  const activeTodoCount = useMemo(() => activeTodos.length, [activeTodos]);
  const activeSuffixText = useMemo(() =>
    activeTodoCount === 1 ? "item left" : "items left",
    [activeTodoCount]
  );

  const completedTodos = useMemo(() =>
    doFilter(filteredTodos, "completed"),
    [filteredTodos]
  );
  const areTodosCompleted = useMemo(
    () => filteredTodos.length === completedTodos.length,
    [filteredTodos, completedTodos]
  );

  return {
    filteredTodos,
    activeTodoCount,
    activeSuffixText,
    completedTodos,
    areTodosCompleted,
  } as const;
};
