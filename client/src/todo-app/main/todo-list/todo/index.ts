import xs, { Stream } from "xstream";
import { li, MainDOMSource } from "@cycle/dom";
import View from "./view";
import Edit from "./edit";

export default (sources: {
  DOM: MainDOMSource;
  props$: Stream<{ title: string; completed: boolean }>;
}) => {
  const view = View({
    ...sources,
    props$: sources.props$,
  });
  const view$ = view.DOM;
  const viewOnDblClick$ = view.onDblclick$;

  const edit = Edit({
    ...sources,
    props$: sources.props$.map((props) => ({ title: props.title })),
  });
  const edit$ = edit.DOM;
  const editOnBlur$ = edit.onBlur$;

  const state$ = xs
    .merge(viewOnDblClick$, editOnBlur$)
    .map((ev) =>
      ev instanceof MouseEvent ? { isEditing: true } : { isEditing: false }
    )
    .startWith({ isEditing: false });

  const sinks = {
    DOM: xs.combine(view$, edit$, state$).map(([view, edit, state]) => {
      requestAnimationFrame(() => {
        if (edit.elm instanceof HTMLInputElement) {
          edit.elm.setSelectionRange(
            edit.elm.value.length,
            edit.elm.value.length,
            "forward"
          );
          edit.elm.focus();
        }
      });
      return li(
        {
          attrs: {
            class: state.isEditing ? "editing" : undefined,
          },
        },
        [view, edit]
      );
    }),
  };
  return sinks;
};
