import xs, { Stream } from "xstream";
import { section, input, label, MainDOMSource } from "@cycle/dom";

export default (sources: {
  DOM: MainDOMSource;
  areTodosCompleted$: Stream<boolean>;
}) => {
  const sinks = {
    DOM: xs.combine(sources.areTodosCompleted$).map(([areTodosCompleted]) => {
      return section([
        input(".toggle-all", {
          attrs: {
            id: "#toggle-all",
            type: "checkbox",
            checked: areTodosCompleted,
          },
        }),
        label({
          attrs: {
            for: "toggle-all",
          },
        }),
      ]);
    }),
  };
  return sinks;
};
