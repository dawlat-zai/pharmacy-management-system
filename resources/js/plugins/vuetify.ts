import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { en } from 'vuetify/locale';
import { ar } from '@/locales/vuetify/ar';

import { defaultLocale, fallbackLocale } from '@/locales';

import '@mdi/font/css/materialdesignicons.css';

import "~/assets/scss/main.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import Cookies from 'js-cookie';

const locale = Cookies.get('locale') || defaultLocale;

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 5,
      darken: 4,
    },
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#2196F3',
          secondary: '#f38221',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#f38221',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  defaults: {
    global: {
      font: {
        family: 'Montserrat',
      },
    },
  },
  locale: {
    locale: locale,
    fallback: fallbackLocale,
    messages: { en, ar },
    rtl: {
      ar: true,
    },
  },
  components,
  directives,
});
