import xs, { MemoryStream } from "xstream";
import { section, MainDOMSource } from "@cycle/dom";
import { HTTPSource } from "@cycle/http";
import Header from "./header/index";
import Main from "./main/index";
import Footer from "./footer/index";

export default (sources: {
  DOM: MainDOMSource;
  HTTP: HTTPSource;
  history: MemoryStream<Location>;
}) => {
  const headerDom = Header(sources);
  const headerDom$ = headerDom.DOM;

  const mainDom = Main(sources);
  const mainDom$ = mainDom.DOM;

  const footerDom = Footer(sources);
  const footerDom$ = footerDom.DOM;

  const sinks = {
    DOM: xs
      .combine(headerDom$, mainDom$, footerDom$)
      .map(([headerDom, mainDom, footerDom]) => {
        return section(".todo-app", [headerDom, mainDom, footerDom]);
      }),
    HTTP: xs.merge(headerDom.HTTP, mainDom.HTTP, footerDom.HTTP),
  };
  return sinks;
};
