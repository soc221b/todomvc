import { postTodo } from "../../apis/todos";
import { useInputElementInputEvent } from "../../composables/useInputElementInputEvent";
import { useImmerRef } from "../../composables/useImmerRef";

export const useNewTodo = () => {
  const [newTodoTitle, setNewTodoTitle] = useImmerRef("");

  const handleInputNewTodo = useInputElementInputEvent((value: string) =>
    setNewTodoTitle(() => value)
  );

  const handleSubmitNewTodo = async () => {
    if (newTodoTitle.value === "") return;

    return postTodo({
      title: newTodoTitle.value,
      completed: false,
    }).then(() => {
      setNewTodoTitle(() => "");
    });
  };

  return {
    newTodoTitle,
    handleInputNewTodo,
    handleSubmitNewTodo,
  } as const;
};
