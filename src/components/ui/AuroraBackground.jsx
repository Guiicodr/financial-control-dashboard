import Aurora from "./Aurora";
import { auroraProps } from "../../lib/auroraTheme";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "../../styles/ui/aurora.css";

/**
 * Camada de fundo animado (Aurora) compartilhada pelas telas.
 * variant "auth": tela de login (veu radial sobre a coluna central).
 * variant "app":  telas internas do app (veu no miolo, fundo visivel nas margens).
 * Com prefers-reduced-motion o shader congela (speed 0): fundo estatico, sem animacao.
 */
function AuroraBackground({ theme = "dark", variant = "app" }) {
  const aurora = auroraProps(theme);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className={"aurora-layer aurora-layer--" + variant} aria-hidden="true">
      <Aurora {...aurora} speed={reduceMotion ? 0 : aurora.speed} />
    </div>
  );
}

export default AuroraBackground;