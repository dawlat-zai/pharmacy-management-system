// i18n imports
import { createI18n } from 'vue-i18n';
import { defaultLocale, fallbackLocale, messages } from '@/locales';
import Cookies from 'js-cookie';
import { setYupLocale } from '@/utils/utils';

const locale = Cookies.get('locale') || defaultLocale;

setYupLocale(locale);

export default createI18n({
    legacy: false,
    globalInjection: true,
    inheritLocale: true,
    messages,
    locale: locale,
    fallbackLocale: fallbackLocale,
});