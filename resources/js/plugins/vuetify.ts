import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

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
  components,
  directives,
});
