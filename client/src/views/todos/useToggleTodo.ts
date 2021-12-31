import { patchTodo } from "../../apis/todos";

import type { Accessor } from "solid-js";
import type { Todo } from "../../types";

export const useToggleTodo = ({
  filteredTodos,
}: {
  filteredTodos: Accessor<Todo[]>;
}) => {
  const toggleTodo = async (todo: Todo) => {
    return patchTodo({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const toggleTodos = async () => {
    const completed = filteredTodos().every((todo) => todo.completed)
      ? false
      : true;
    return Promise.allSettled(
      filteredTodos().map((todo) =>
        patchTodo({
          id: todo.id,
          completed,
        })
      )
    );
  };

  return {
    toggleTodo,
    toggleTodos,
  } as const;
};
