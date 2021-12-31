import xs from "xstream";
import { div, header, MainDOMSource } from "@cycle/dom";
import H1 from "./h1";
import Input from "./input";

export default (sources: { DOM: MainDOMSource }) => {
  const h1 = H1();
  const h1Dom$ = h1.DOM;

  const input = Input(sources);
  const inputDom$ = input.DOM;

  const sinks = {
    DOM: xs.combine(h1Dom$, inputDom$).map(([h1Dom, inputDom]) => {
      return header(".header", [h1Dom, inputDom]);
    }),
    HTTP: input.HTTP,
  };
  return sinks;
};
