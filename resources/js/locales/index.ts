import { Locales, LOCALES } from './locales';

import en from './en.json';
import ps from './ps.json';

/* TODO add lazy loading for translations
 * see https://vue-i18n.intlify.dev/guide/advanced/lazy.html
 */

export const messages = {en, ps};

export const defaultLocale = Locales.EN;
export const fallbackLocale = Locales.EN;