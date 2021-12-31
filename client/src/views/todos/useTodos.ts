import { ref } from "vue";
import { getTodos as _getTodos } from "../../apis/todos";

import type { Todo } from "../../types";

export const useTodos = () => {
  const todos = ref<Todo[]>([]);

  const getTodos = async () => {
    return _getTodos().then((value) => {
      todos.value = value;
    });
  };

  return {
    todos,
    getTodos,
  } as const;
};
