import { useState } from "react";
import { getTodos as _getTodos } from "../../apis/todos";

import type { Todo } from "../../types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

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
