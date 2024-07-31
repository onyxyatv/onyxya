import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@common/translations/en/translation.json";
import fr from "@common/translations/fr/translation.json";
const lang = localStorage.getItem("onyxyaLang") || "en";

i18n
  .use(initReactI18next)
  .init({
    lng: lang,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
  });

export default i18n;
