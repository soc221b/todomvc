import { createApp } from "vue";
import App from "./App.vue";
import { autofocus } from "./directives/autofocus";

createApp(App).directive("autofocus", autofocus).mount("#app");
