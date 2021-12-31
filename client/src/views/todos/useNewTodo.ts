import { useState } from "react";
import { postTodo } from "../../apis/todos";

export const useNewTodo = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleInputNewTodo = (value: string) => setNewTodoTitle(() => value);

  const handleSubmitNewTodo = async () => {
    if (newTodoTitle === "") return;

    return postTodo({
      title: newTodoTitle,
      completed: false,
    }).then(() => {
      setNewTodoTitle("");
    });
  };

  return {
    newTodoTitle,
    handleInputNewTodo,
    handleSubmitNewTodo,
  } as const;
};
