import xs, { Stream } from "xstream";
import { button, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";

export default (sources: {
  DOM: MainDOMSource;
  HTTP: HTTPSource;
  completedTodoCount$: Stream<number>;
}) => {
  const requestGetAll$ = xs.of(null).map(() => {
    return {
      url: "http://localhost:3000/todos",
      category: "clear-completed-get-all",
    };
  });
  const responseGetAll$ = sources.HTTP.select("clear-completed-get-all")
    .flatten()
    .map((response) => response.body as { id: number; completed: boolean }[]);

  const requestClearCompleted$ = xs
    .combine(
      sources.DOM.select(".clear-completed").events("click"),
      responseGetAll$.map((allTodos) =>
        allTodos.filter((todo) => todo.completed)
      )
    )
    .map(([_, allTodos]) => {
      return allTodos
        .filter((todo) => todo.completed)
        .map((todo) => {
          return {
            url: `http://localhost:3000/todos/${todo.id}`,
            method: "DELETE",
            category: "clear-completed-delete",
          };
        })
        .flat();
    });

  const sinks = {
    DOM: xs.combine(responseGetAll$).map(([allTodos]) => {
      return button(
        ".clear-completed",
        {
          style: {
            display:
              allTodos.filter((todo) => todo.completed).length > 0
                ? undefined
                : "none",
          },
        },
        "Clear completed"
      );
    }),
    HTTP: xs.merge(requestClearCompleted$, requestGetAll$),
  };
  return sinks;
};
