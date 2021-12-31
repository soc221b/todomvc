import TodoApp from "./todo-app/index";
import xs, { MemoryStream } from "xstream";
import { run } from "@cycle/run";
import { makeDOMDriver, MainDOMSource } from "@cycle/dom";
import { makeHistoryDriver } from "@cycle/history";
import { makeHTTPDriver, HTTPSource } from "@cycle/http";

function main(sources: {
  DOM: MainDOMSource;
  HTTP: HTTPSource;
  history: MemoryStream<Location>;
}) {
  const todoApp = TodoApp(sources);
  const todoAppDom$ = todoApp.DOM;

  const sinks = {
    DOM: xs.combine(todoAppDom$).map(([todoAppDom]) => todoAppDom),
    HTTP: todoApp.HTTP,
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver("#app"),
  HTTP: makeHTTPDriver(),
  history: makeHistoryDriver(),
};

run(main, drivers);
