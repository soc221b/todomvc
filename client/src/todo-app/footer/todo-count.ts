import xs, { Stream } from "xstream";
import { span, strong, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";

export default (sources: { DOM: MainDOMSource; HTTP: HTTPSource }) => {
  const request$ = xs.of({
    url: "http://localhost:3000/todos",
    category: "todos",
  });

  const response$ = sources.HTTP.select("todos")
    .flatten()
    .map((response) => response.body as { completed: boolean }[])
    .map((todos) => todos.filter((todo) => todo.completed === false))
    .map((activeTodos) => activeTodos.length);

  const sinks = {
    DOM: xs.combine(response$).map(([activeTodoCount]) => {
      return span(".todo-count", [
        strong([activeTodoCount]),
        ` item${activeTodoCount === 1 ? "" : "s"} left`,
      ]);
    }),
    HTTP: request$,
  };
  return sinks;
};
