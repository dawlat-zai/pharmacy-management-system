import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { defaultLocale } from '@/locales';

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: Cookies.get('locale') || defaultLocale,
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
      Cookies.set('locale', newLocale, { expires: 365 });
    },
  },
});