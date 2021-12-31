import { deleteTodo } from "../../apis/todos";

import type { Accessor } from "solid-js";
import type { Todo } from "../../types";

export const useDeleteTodo = ({
  completedTodos,
}: {
  completedTodos: Accessor<Todo[]>;
}) => {
  const handleDeleteTodo = async (todo: Todo) => {
    return deleteTodo(todo);
  };

  const handleDeleteCompletedTodos = async () => {
    return Promise.allSettled(
      completedTodos().map(({ id }) => deleteTodo({ id }))
    );
  };

  return {
    handleDeleteTodo,
    handleDeleteCompletedTodos,
  } as const;
};
