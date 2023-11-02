import { createApp } from 'vue';
import App from '@/App.vue';

// i18n imports
import { createI18n } from 'vue-i18n';
import { defaultLocale, messages } from './locales';

// vuetify imports
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

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

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(i18n);

app.use(vuetify);

app.use(router);

app.mount('#app');
