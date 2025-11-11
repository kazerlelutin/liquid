import { LANGS } from "./lang-selector.const";
import { getLang, setLang } from "./lang-selector.store";
import { For } from "solid-js";

export const LangSelector = () => {
  return (
    <select value={getLang()} onInput={(e) => setLang(e.currentTarget?.value as "fr" | "en")}>
      <For each={LANGS}>
        {(lang) => <option value={lang.value}>{lang.label[lang.value as "fr" | "en"]}</option>}
      </For>
    </select>
  )
}