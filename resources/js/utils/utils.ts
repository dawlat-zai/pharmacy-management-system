import { messages } from "@/locales";
import { LocaleObject, setLocale } from "yup";

export const setYupLocale = (locale) => {
    const yupLocale: LocaleObject = {
        mixed: {
          required: messages[locale].validation.required
        },
        string: {
          email: messages[locale].validation.email
        }
    };
    setLocale(yupLocale);
}