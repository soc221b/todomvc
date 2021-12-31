import produce from "immer";
import { useState } from "react";
import { deleteTodo, patchTodo } from "../../apis/todos";

import type { Todo } from "../../types";

export const useEditTodo = () => {
  const [editingTodo, setEditingTodo] = useState<Todo>();

  const isTodoEditing = (todo: Todo) => {
    return editingTodo?.id === todo.id;
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleChangeEditingTodoTitle = (value: string) => {
    setEditingTodo(
      produce((draft) => {
        if (draft === undefined) return;

        draft.title = value;
      })
    );
  };

  const handleDoneEditingTodo = async () => {
    const theEditingTodo = editingTodo;
    if (theEditingTodo === undefined) return;

    if (theEditingTodo.title === "") {
      return deleteTodo(theEditingTodo).then(() => {
        setEditingTodo(undefined);
      });
    } else {
      return patchTodo(theEditingTodo).then(() => {
        setEditingTodo(undefined);
      });
    }
  };

  const handleCancelEditingTodo = () => {
    setEditingTodo(undefined);
  };

  return {
    editingTodo,
    isTodoEditing,
    handleEditTodo,
    handleChangeEditingTodoTitle,
    handleDoneEditingTodo,
    handleCancelEditingTodo,
  } as const;
};
