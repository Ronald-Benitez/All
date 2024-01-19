import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./en.json";
import spanish from "./es.json";
import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";
import { Storage } from "expo-storage";

const fallbackLanguage = "en";

const initializeI18n = async () => {
  let storedLanguage;
  try {
    storedLanguage = await Storage.getItem({ key: "language" });
  } catch (error) {
    console.error("Error retrieving language from storage:", error);
  }

  i18n
    .use(initReactI18next)
    .use(RNLanguageDetector)
    .init({
      compatibilityJSON: "v3",
      debug: true,
      fallbackLng: fallbackLanguage,
      lng: storedLanguage || undefined,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: english,
        },
        es: {
          translation: spanish,
        },
      },
    });

  if (!storedLanguage) {
    try {
      await Storage.setItem({ key: "language", value: i18n.language });
    } catch (error) {
      console.error("Error storing language:", error);
    }
  }
};

if (!i18n.isInitialized) {
  initializeI18n().catch((error) =>
    console.error("Error initializing i18n:", error)
  );
}

export default i18n;
