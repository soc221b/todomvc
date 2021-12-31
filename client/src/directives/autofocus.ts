import type { Directive } from "vue";

export const autofocus: Directive = {
  mounted(el) {
    typeof el.focus === "function" && el.focus();
  },
};
