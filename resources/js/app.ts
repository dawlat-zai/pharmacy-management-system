import { createApp } from 'vue';
import App from '@/App.vue';

// i18n imports
import { createI18n } from 'vue-i18n';
import { defaultLocale, messages } from './locales';

// vuetify imports
import 'vuetify/styles';
import vuetify from '@/plugins/vuetify';

// vue router import
import router from './router';

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

app.use(vuetify);

app.use(router);

app.mount('#app');
