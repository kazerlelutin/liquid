import { A } from "@solidjs/router"
import { LangSelector } from "~/features/lang-selector/lang-selector"
import { MiniGame } from "~/features/mini-game/mini-game"
import { For } from "solid-js"
import { Logo } from "../Logo"

const menuEntries = [
  { label: "Accueil", href: "/" },
  { label: "Billeterie", href: "/ticket" },
  { label: "Infos pratiques", href: "/about" },
  { label: "Évènements", href: "/about" },
]
export const Header = () => {
  return (
    <header class="grid grid-rows-[auto_1fr] h-[100dvh]">
      <div class="flex justify-between items-center p-2">
        <div class="flex items-center gap-4">
          <A href="/">
            <Logo />
          </A>
          <nav class="flex items-center gap-4 text-text">
            <For each={menuEntries}>
              {(entry) => <A href={entry.href} class="hover:text-primary text-text">{entry.label}</A>}
            </For>
          </nav>
        </div>
        <LangSelector />
      </div>
      <MiniGame />
    </header>
  )
}