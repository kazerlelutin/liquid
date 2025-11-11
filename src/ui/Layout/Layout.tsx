import { A } from "@solidjs/router"
import { type JSX } from "solid-js"
import { ToastContainer } from "../Toast"
import { Header } from "~/ui/Header/Header"

type LayoutProps = {
  children: JSX.Element
}

export const Layout = (props: LayoutProps) => {

  return (
    <>
      <ToastContainer />
      <div class=" bg-bg">
        <Header />
        <div class="grid grid-rows-[1fr_auto] gap-2 h-[100dvh] ">
          <div class="h-full relative">
            <div class="absolute inset-0 p-4">
              {props.children}
            </div>
          </div>
          <footer class="flex justify-center gap-4 pb-4" >
            <A href="/">Accueil</A>
          </footer >
        </div >
      </div >
    </>
  )
}