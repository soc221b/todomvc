import xs, { MemoryStream } from "xstream";
import { ul, li, a, MainDOMSource } from "@cycle/dom";

export default (sources: {
  DOM: MainDOMSource;
  history: MemoryStream<Location>;
}) => {
  const sinks = {
    DOM: sources.history.map((history) => {
      return ul(
        `.filters`,
        ["all", "active", "completed"].map((filter) => {
          return li([
            a(
              {
                attrs: {
                  class:
                    (history.hash === "" && filter === "all") ||
                    history.hash === `#${filter}`
                      ? "selected"
                      : undefined,
                  href: `/#${filter}`,
                },
              },
              [filter[0].toUpperCase() + filter.slice(1)]
            ),
          ]);
        })
      );
    }),
  };
  return sinks;
};
