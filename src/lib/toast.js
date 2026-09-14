/**
 * Canal simples de notificacoes (toasts) via CustomEvent.
 * Evita Context/Provider e mantem os componentes puros.
 */

const EVENT = "finanly:toast";

export function pushToast(message, tone = "success") {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message: message, tone: tone } }));
}

export function subscribeToasts(handler) {
  const listener = (event) => handler(event.detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export default pushToast;

