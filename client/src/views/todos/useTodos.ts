import { createSignal } from "solid-js";
import { getTodos as _getTodos } from "../../apis/todos";

import type { Todo } from "../../types";

export const useTodos = () => {
  const [todos, setTodos] = createSignal<Todo[]>([]);

  const getTodos = async () => {
    return _getTodos().then((value) => {
      setTodos(value);
    });
  };

  return {
    todos,
    getTodos,
  } as const;
};
