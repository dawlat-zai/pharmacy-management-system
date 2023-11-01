import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import { defaultLocale, messages } from './locales';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  inheritLocale: true,
  messages,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
});

const app = createApp(App);

app.use(i18n);

app.mount('#app');
