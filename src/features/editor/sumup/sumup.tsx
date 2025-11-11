import { Show, type VoidComponent } from "solid-js";
import { SumUpCtrl } from "./sumup.ctrl";

export const SumUp: VoidComponent = () => {


  const { showPaymentWidget, paymentStatus, pay, closePaymentWidget, cardContainer } = SumUpCtrl();


  return (
    <>
      <button onClick={pay} class="mb-4 px-6 py-3 bg-[#FF8C00] text-white font-bold border-2 border-black rounded hover:bg-[#FFA500] transition-colors">Payer</button>

      <Show when={showPaymentWidget()}>
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-8 border-4 border-[#FF8C00]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-[#FFD700] border-b-2 border-[#FF8C00] pb-2">Paiement</h2>
            <button
              onClick={closePaymentWidget}
              class="text-[#FF0000] hover:text-[#DC143C] font-bold text-xl"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <Show when={paymentStatus()}>
            <div class="mb-4 p-3 rounded bg-[#87CEEB] text-black border-2 border-[#4682B4] font-semibold">
              {paymentStatus()}
            </div>
          </Show>

          {/* Conteneur pour le widget SumUp */}
          <div id="sumup-card" ref={cardContainer} />
        </div>
      </Show>
    </>
  );
};
