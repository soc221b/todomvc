import { getTodos as _getTodos } from "../../apis/todos";
import { useImmerRef } from "../../composables/useImmerRef";

import type { Todo } from "../../types";

export const useTodos = () => {
  const [todos, setTodos] = useImmerRef<Todo[]>([]);

  const getTodos = async () => {
    return _getTodos().then((value) => {
      setTodos(() => value);
    });
  };

  return {
    todos,
    getTodos,
  } as const;
};
