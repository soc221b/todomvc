import xs from "xstream";
import { ul, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";
import Todo from "./todo/index";

export default (sources: { DOM: MainDOMSource; HTTP: HTTPSource }) => {
  const request$ = xs.of({
    url: "http://localhost:3000/todos",
    category: "todos",
  });

  const response$ = sources.HTTP.select("todos").flatten();

  const todos$$ = response$
    .map((response) => response.body as { title: string; completed: boolean }[])
    .map((todos) => {
      return todos.map((todo) => {
        return Todo({
          ...sources,
          props$: xs.of<{ title: string; completed: boolean }>(todo),
        }).DOM;
      });
    })
    .startWith([]);

  const todo$ = Todo({
    ...sources,
    props$: xs.of<{ title: string; completed: boolean }>({
      title: "Welcome",
      completed: false,
    }),
  }).DOM;

  const sinks = {
    DOM: xs.combine(todo$).map(([todo]) => {
      return ul(".todo-list", [todo]);
    }),
    HTTP: request$,
  };
  return sinks;
};
