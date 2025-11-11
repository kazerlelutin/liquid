import { type VoidComponent } from "solid-js";
import { SumUp } from "~/features/editor/sumup/sumup";


const Home: VoidComponent = () => {

  return (
    <main class="flex flex-col items-center justify-center relative h-full bg-[#87CEEB]">
      <div class="absolute inset-0 overflow-y-auto flex flex-col items-center">
        <SumUp />
      </div>
    </main >
  );
};

export default Home;