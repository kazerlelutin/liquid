import { Cal } from "~/ui/Cal";

export default function Ticket() {
  return (
    <main class="flex flex-col items-center justify-center relative h-full text-white">
      <div class="absolute inset-0 flex flex-col items-center justify-baseline">
        <Cal />
      </div>
    </main >
  )
}