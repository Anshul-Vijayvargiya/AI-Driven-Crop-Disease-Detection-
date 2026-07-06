import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import mrTranslations from "./locales/mr.json";
import guTranslations from "./locales/gu.json";
import paTranslations from "./locales/pa.json";
import taTranslations from "./locales/ta.json";

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  mr: { translation: mrTranslations },
  gu: { translation: guTranslations },
  pa: { translation: paTranslations },
  ta: { translation: taTranslations }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
