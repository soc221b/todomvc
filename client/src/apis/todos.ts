import type { Todo } from "../types";

export const getTodos = () => {
  return fetch("http://localhost:3000/todos")
    .then((response) => {
      return response.json() as Promise<Todo[]>;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

export const postTodo = ({
  title,
  completed,
}: Pick<Todo, "title" | "completed">) => {
  return fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      completed,
    }),
  }).catch((error) => {
    console.error(error);
    return;
  });
};

export const patchTodo = ({
  id,
  title,
  completed,
}: Pick<Todo, "id"> & Partial<Pick<Todo, "title" | "completed">>) => {
  return fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      completed,
    }),
  }).catch((error) => {
    console.error(error);
    return;
  });
};

export const deleteTodo = ({ id }: Pick<Todo, "id">) => {
  return fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    console.error(error);
    return;
  });
};
