import xs from "xstream";
import { section, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";
import ToggleAll from "./toggle-all";
import TodoList from "./todo-list/index";

export default (sources: { DOM: MainDOMSource; HTTP: HTTPSource }) => {
  const toggleAll = ToggleAll({ ...sources, areTodosCompleted$: xs.of(false) });
  const toggleAll$ = toggleAll.DOM;

  const todoList = TodoList(sources);
  const todoList$ = todoList.DOM;

  const sinks = {
    DOM: xs.combine(toggleAll$, todoList$).map(([toggleAll, todoList]) => {
      return section(".main", [toggleAll, todoList]);
    }),
    HTTP: todoList.HTTP,
  };
  return sinks;
};
