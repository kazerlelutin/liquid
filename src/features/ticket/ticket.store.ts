import { createStore } from "solid-js/store/types/server.js";

export const [ticketStore, setTicketStore] = createStore({
  selectedDate: null,
  tickets: [],
  donationAmount: 0,
  slot: null,
});
