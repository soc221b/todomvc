import { ref } from "vue";
import { deleteTodo, patchTodo } from "../../apis/todos";
import { useInputElementInputEvent } from "../../composables/useInputElementInputEvent";

import type { DeepReadonly } from "vue";
import type { Todo } from "../../types";

export const useEditTodo = () => {
  const editingTodo = ref<Todo | undefined>(undefined);

  const isTodoEditing = (todo: DeepReadonly<Todo>) => {
    return editingTodo.value?.id === todo.id;
  };

  const handleEditTodo = (todo: DeepReadonly<Todo>) => {
    editingTodo.value = todo;
  };

  const handleChangeEditingTodoTitle = useInputElementInputEvent(
    (value: string) => {
      if (editingTodo.value === undefined) return;
      editingTodo.value = {
        ...editingTodo.value,
        title: value,
      };
    }
  );

  const handleDoneEditingTodo = async () => {
    if (editingTodo.value === undefined) return;

    if (editingTodo.value.title === "") {
      return deleteTodo(editingTodo.value).then(() => {
        editingTodo.value = undefined;
      });
    } else {
      return patchTodo(editingTodo.value).then(() => {
        editingTodo.value = undefined;
      });
    }
  };

  const handleCancelEditingTodo = () => {
    editingTodo.value = undefined;
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
