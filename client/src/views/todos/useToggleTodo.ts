import { patchTodo } from "../../apis/todos";

import type { ComputedRef, DeepReadonly } from "vue";
import type { Todo } from "../../types";

export const useToggleTodo = ({
  filteredTodos,
}: {
  filteredTodos: ComputedRef<DeepReadonly<Todo[]>>;
}) => {
  const toggleTodo = async (todo: Todo) => {
    return patchTodo({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const toggleTodos = async () => {
    const completed = filteredTodos.value.every((todo) => todo.completed)
      ? false
      : true;
    return Promise.allSettled(
      filteredTodos.value.map((todo) =>
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
