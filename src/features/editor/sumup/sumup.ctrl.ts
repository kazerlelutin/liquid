import { createEffect, createSignal, onMount } from "solid-js";
import type { SumUpCardInstance, SumUpResponseBody } from "./sumup.types";
import { clientEnv } from "~/env/client";

export const SumUpCtrl = () => {


  const [showPaymentWidget, setShowPaymentWidget] = createSignal(false);
  const [checkoutId, setCheckoutId] = createSignal<string | null>(null);
  const [paymentStatus, setPaymentStatus] = createSignal<string | null>(null);
  let sumupCardInstance: SumUpCardInstance | null = null;
  let cardContainer: HTMLDivElement | undefined;

  onMount(() => {
    if (!document.querySelector('script[src*="sumup.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
      script.async = true;
      script.onload = () => {
        console.log('SDK SumUp chargé');
      };
      document.head.appendChild(script);
    }
  });


  createEffect(() => {
    const show = showPaymentWidget();
    const id = checkoutId();

    if (show && id && cardContainer) {
      const mountWidget = () => {
        if (window.SumUpCard && cardContainer) {
          if (sumupCardInstance) {
            sumupCardInstance.unmount();
            sumupCardInstance = null;
          }
          cardContainer.innerHTML = '';

          sumupCardInstance = window.SumUpCard.mount({
            id: 'sumup-card',
            checkoutId: id,
            onResponse: (type: string, body: SumUpResponseBody) => {
              console.log('Type:', type);
              console.log('Body:', body);

              switch (type) {
                case 'sent':
                  setPaymentStatus('Envoi en cours...');
                  break;
                case 'invalid':
                  setPaymentStatus('Erreur de validation. Veuillez vérifier vos informations.');
                  break;
                case 'auth-screen':
                  setPaymentStatus('Authentification en cours...');
                  break;
                case 'error':
                  setPaymentStatus(`Erreur: ${body?.message || 'Une erreur est survenue'}`);
                  break;
                case 'success':
                  setPaymentStatus('Paiement réussi !');
                  verifyCheckoutStatus(id);
                  break;
                case 'fail':
                  setPaymentStatus('Paiement échoué ou annulé.');
                  break;
              }
            },
          });
        } else if (show && id) {
          setTimeout(mountWidget, 100);
        }
      };

      mountWidget();
    }

    if (!show && sumupCardInstance) {
      sumupCardInstance.unmount();
      sumupCardInstance = null;
    }
  });

  const pay = async () => {
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/pay/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: 12,
          currency: 'EUR',
          description: 'Test de paiement',
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout créé:', data);

      if (data.id) {
        setCheckoutId(data.id);
        setShowPaymentWidget(true);
        setPaymentStatus(null);
      } else {
        console.error('Erreur: pas d\'ID de checkout reçu');
        alert('Erreur lors de la création du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Une erreur est survenue lors de la création du paiement. Veuillez réessayer.');
    }
  }

  const verifyCheckoutStatus = async (id: string) => {
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/pay/checkout/${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const checkoutData = await response.json();

        if (checkoutData.status === 'PAID') {
          setPaymentStatus('Paiement confirmé avec succès !');
        } else {
          setPaymentStatus(`Statut: ${checkoutData.status}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  }

  const closePaymentWidget = () => {
    if (sumupCardInstance) {
      sumupCardInstance.unmount();
      sumupCardInstance = null;
    }
    setShowPaymentWidget(false);
    setCheckoutId(null);
    setPaymentStatus(null);
  }

  return {
    showPaymentWidget,
    checkoutId,
    paymentStatus,
    pay,
    verifyCheckoutStatus,
    closePaymentWidget,
    cardContainer
  }
}