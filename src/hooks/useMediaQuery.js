import { useCallback, useSyncExternalStore } from "react";

/**
 * Observa uma media query e devolve true/false conforme o viewport.
 * Usada para decidir qual navegacao renderizar: navbar no topo no desktop,
 * menu deslizante + barra inferior em telas menores.
 * Le o matchMedia como fonte externa, sem estado duplicado.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export default useMediaQuery;