import Aurora from "./Aurora";
import { auroraProps } from "../../lib/auroraTheme";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "../../styles/ui/aurora.css";

/**
 * Camada de fundo animado (Aurora) das telas iniciais (inicio, entrar e criar
 * conta). Depois do login o app usa o fundo chapado de --bg-main, entao este
 * componente nao e renderizado no shell autenticado.
 *
 * IMPORTANTE: monte este componente UMA vez (hoje no App, na area publica) e
 * nao dentro de cada tela. Cada montagem cria um contexto WebGL novo e compila o
 * shader de novo; quando o inicio e o acesso tinham a sua propria instancia, a
 * troca entre as duas telas descartava e recriava o canvas — o app dava uma
 * engasgada visivel e a animacao reiniciava do zero. Com a instancia unica a
 * transicao so mexe no conteudo. As telas publicas ficam com fundo transparente
 * para a Aurora aparecer por tras (ver styles/pages/home.css e auth.css).
 *
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