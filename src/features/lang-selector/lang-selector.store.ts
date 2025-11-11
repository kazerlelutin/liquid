import { createStore } from "solid-js/store";
import type { LangSelectorStore } from "./lang-selector.types";
import { LANGS } from "./lang-selector.const";


const LS_KEY = "liquid-lang";

export const [langSelectorStore, setLangSelectorStore] = createStore<LangSelectorStore>({
  lang: LANGS[0].value as "fr" | "en"
});

export const getLang = () => {
  const lang = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
  if (lang) {
    return lang;
  }
  return "fr";
};

export const setLang = (lang: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, lang);
  }
  setLangSelectorStore({
    lang: lang as LangSelectorStore["lang"]
  });
};

