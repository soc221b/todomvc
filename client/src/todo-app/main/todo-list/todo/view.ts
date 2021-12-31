import xs, { Stream } from "xstream";
import { div, input, label, button, MainDOMSource } from "@cycle/dom";

export default (sources: {
  DOM: MainDOMSource;
  props$: Stream<{ completed: boolean; title: string }>;
}) => {
  const sinks = {
    DOM: xs.combine(sources.props$).map(([props]) => {
      return div(".view", [
        input(".toggle", {
          attrs: {
            type: "checkbox",
            checked: props.completed,
          },
        }),
        label([props.title]),
        button(".destroy"),
      ]);
    }),
    onDblclick$: sources.DOM.select("label").events("dblclick"),
  };
  return sinks;
};
