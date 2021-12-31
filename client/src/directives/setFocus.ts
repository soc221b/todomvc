export const setFocus = (el: HTMLInputElement) =>
  setTimeout(() => typeof el.focus === "function" && el.focus());
