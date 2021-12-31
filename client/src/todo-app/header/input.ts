import xs from "xstream";
import { input, MainDOMSource } from "@cycle/dom";

export default (sources: { DOM: MainDOMSource }) => {
  const createTodo$ = sources.DOM.select(".new-todo")
    .events("keypress")
    .filter((ev) => ev.key === "Enter")
    .map((ev) => {
      return {
        url: "http://localhost:3000/todos",
        method: "POST",
        send: {
          title: (ev.target as HTMLInputElement).value,
          completed: false,
        },
      };
    });

  const sinks = {
    DOM: xs.of(null).map(() => {
      return input(".new-todo", {
        attrs: {
          autofocus: true,
          autocomplete: "off",
          placeholder: "What needs to be done?",
        },
      });
    }),
    HTTP: createTodo$,
  };
  return sinks;
};
