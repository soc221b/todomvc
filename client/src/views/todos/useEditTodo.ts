import { nothing } from "immer";
import { deleteTodo, patchTodo } from "../../apis/todos";
import { useInputElementInputEvent } from "../../composables/useInputElementInputEvent";
import { useImmerRef } from "../../composables/useImmerRef";

import type { DeepReadonly } from "vue";
import type { Todo } from "../../types";

export const useEditTodo = () => {
  const [editingTodo, setEditingTodo] = useImmerRef<Todo | undefined>(
    undefined
  );

  const isTodoEditing = (todo: DeepReadonly<Todo>) => {
    return editingTodo.value?.id === todo.id;
  };

  const handleEditTodo = (todo: DeepReadonly<Todo>) => {
    setEditingTodo(() => todo);
  };

  const handleChangeEditingTodoTitle = useInputElementInputEvent(
    (value: string) => {
      setEditingTodo((draft) => {
        if (draft === undefined) return;
        draft.title = value;
      });
    }
  );

  const handleDoneEditingTodo = async () => {
    if (editingTodo.value === undefined) return;

    if (editingTodo.value.title === "") {
      return deleteTodo(editingTodo.value).then(() => {
        setEditingTodo(() => nothing);
      });
    } else {
      return patchTodo(editingTodo.value).then(() => {
        setEditingTodo(() => nothing);
      });
    }
  };

  const handleCancelEditingTodo = () => {
    setEditingTodo(() => nothing);
  };

  return {
    editingTodo,
    setEditingTodo,
    isTodoEditing,
    handleEditTodo,
    handleChangeEditingTodoTitle,
    handleDoneEditingTodo,
    handleCancelEditingTodo,
  } as const;
};
