import xs, { Stream } from "xstream";
import { input, MainDOMSource } from "@cycle/dom";

export default (sources: {
  DOM: MainDOMSource;
  props$: Stream<{ title: string }>;
}) => {
  const sinks = {
    DOM: sources.props$.map((props) => {
      return input(".edit", {
        attrs: {
          value: props.title,
        },
      });
    }),
    onBlur$: sources.DOM.select(".edit").events("blur"),
  };
  return sinks;
};
