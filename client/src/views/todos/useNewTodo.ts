import { ref } from "vue";
import { postTodo } from "../../apis/todos";
import { useInputElementInputEvent } from "../../composables/useInputElementInputEvent";

export const useNewTodo = () => {
  const newTodoTitle = ref("");

  const handleInputNewTodo = useInputElementInputEvent(
    (value: string) => (newTodoTitle.value = value)
  );

  const handleSubmitNewTodo = async () => {
    if (newTodoTitle.value === "") return;

    return postTodo({
      title: newTodoTitle.value,
      completed: false,
    }).then(() => {
      newTodoTitle.value = "";
    });
  };

  return {
    newTodoTitle,
    handleInputNewTodo,
    handleSubmitNewTodo,
  } as const;
};
