import { useTranslation } from "react-i18next";
import BlurHighlight from "../ui/BlurHighlight";
import HomeTopBar from "./HomeTopBar";
import "../../styles/ui/primitives.css";

/**
 * Hero da tela inicial: a barra de acesso fica logo acima da chamada principal,
 * com as duas entradas do produto (entrar / criar conta). O formulario so
 * aparece depois do clique.
 */
function HomeHero({ theme, onToggleTheme, onAccess }) {
  const { t } = useTranslation();
  /* Trechos destacados do subtitulo: array do dicionario, como as notas do
     dashboard. A busca ignora acento, entao "suba de nível" casa com o texto. */
  const highlights = t("home.subtitleHighlights", { returnObjects: true });

  return (
    <section className="home-hero">
      <HomeTopBar theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />

      <h1 className="home-title">{t("home.title")}</h1>

      <BlurHighlight
        className="home-subtitle"
        highlights={highlights}
        delay={180}
        step={70}
        duration={800}
      >
        {t("home.subtitle")}
      </BlurHighlight>
    </section>
  );
}

export default HomeHero;