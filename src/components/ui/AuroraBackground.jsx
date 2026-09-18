import Aurora from "./Aurora";
import { auroraProps } from "../../lib/auroraTheme";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "../../styles/ui/aurora.css";

/**
 * Camada de fundo animado (Aurora) das telas iniciais (inicio, entrar e criar
 * conta). Depois do login o app usa o fundo chapado de --bg-main, entao este
 * componente nao e renderizado no shell autenticado.
 * Com prefers-reduced-motion o shader congela (speed 0): fundo estatico, sem animacao.
 */
function AuroraBackground({ theme = "dark" }) {
  const aurora = auroraProps(theme);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className="aurora-layer aurora-layer--veil" aria-hidden="true">
      <Aurora {...aurora} speed={reduceMotion ? 0 : aurora.speed} />
    </div>
  );
}

export default AuroraBackground;