import { createApp } from 'vue';
import App from '@/App.vue';

// vuetify imports
import 'vuetify/styles';
import vuetify from '@/plugins/vuetify';

import i18n from '@/plugins/i18n';

// vue router import
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(i18n);

app.use(vuetify);

app.use(router);

app.use(createPinia());

app.mount('#app');
