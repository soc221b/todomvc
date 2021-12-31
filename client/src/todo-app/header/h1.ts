import xs from "xstream";
import { h1, MainDOMSource } from "@cycle/dom";

export default () => {
  const sinks = {
    DOM: xs.of(null).map(() => {
      return h1("todos");
    }),
  };
  return sinks;
};
