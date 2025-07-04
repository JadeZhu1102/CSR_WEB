import { createSSRApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "./App.vue";
import i18nConfig from "./i18n";

export function createApp() {
  const app = createSSRApp(App);

  const i18n = createI18n({
    ...i18nConfig,
    legacy: false,
  });
  app.use(i18n);

  return {
    app,
  };
}
