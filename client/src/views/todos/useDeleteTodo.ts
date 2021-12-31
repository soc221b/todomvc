import { deleteTodo } from "../../apis/todos";

import type { ComputedRef, DeepReadonly } from "vue";
import type { Todo } from "../../types";

export const useDeleteTodo = ({
  completedTodos,
}: {
  completedTodos: ComputedRef<DeepReadonly<Todo[]>>;
}) => {
  const handleDeleteTodo = async (todo: Todo) => {
    return deleteTodo(todo);
  };

  const handleDeleteCompletedTodos = async () => {
    return Promise.allSettled(
      completedTodos.value.map(({ id }) => deleteTodo({ id }))
    );
  };

  return {
    handleDeleteTodo,
    handleDeleteCompletedTodos,
  } as const;
};
