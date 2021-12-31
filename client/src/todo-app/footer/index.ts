import xs, { MemoryStream } from "xstream";
import { footer, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";
import TodoCount from "./todo-count";
import Filters from "./filters";
import ClearCompleted from "./clear-completed";

export default (sources: {
  DOM: MainDOMSource;
  HTTP: HTTPSource;
  history: MemoryStream<Location>;
}) => {
  const todoCount = TodoCount(sources);
  const todoCountDom$ = todoCount.DOM;

  const filters = Filters(sources);
  const filters$ = filters.DOM;

  const clearCompleted = ClearCompleted({
    ...sources,
    completedTodoCount$: xs
      .periodic(1000)
      .map((i) => i % 2)
      .startWith(0),
  });
  const clearCompleted$ = clearCompleted.DOM;

  const sinks = {
    DOM: xs
      .combine(todoCountDom$, filters$, clearCompleted$)
      .map(([todoCount, filters, clearCompleted]) => {
        return footer(".footer", [todoCount, filters, clearCompleted]);
      }),
    HTTP: xs.merge(todoCount.HTTP, clearCompleted.HTTP),
  };
  return sinks;
};
