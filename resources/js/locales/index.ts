import { Locales, LOCALES } from './locales';

import en from './en.json';
import ar from './ar.json';

/* TODO add lazy loading for translations
 * see https://vue-i18n.intlify.dev/guide/advanced/lazy.html
 */

export const messages = {en, ar};

export const defaultLocale = Locales.EN;
export const fallbackLocale = Locales.EN;