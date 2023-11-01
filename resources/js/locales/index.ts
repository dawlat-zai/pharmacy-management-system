import { Locales } from './locales';

import enShared from './en/shared.json';

/* TODO add lazy loading for translations
 * see https://vue-i18n.intlify.dev/guide/advanced/lazy.html
 */

export const messages = {
  [Locales.EN]: {
    shared: enShared,
  },
};

export const defaultLocale = Locales.EN;
