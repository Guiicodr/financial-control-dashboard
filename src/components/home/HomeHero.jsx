import { useTranslation } from "react-i18next";
import HomeTopBar from "./HomeTopBar";
import "../../styles/ui/primitives.css";

/**
 * Hero da tela inicial: a barra de acesso fica logo acima da chamada principal,
 * com as duas entradas do produto (entrar / criar conta). O formulario so
 * aparece depois do clique.
 */
function HomeHero({ theme, onToggleTheme, onAccess }) {
  const { t } = useTranslation();

  return (
    <section className="home-hero">
      <HomeTopBar theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />

      <h1 className="home-title">{t("home.title")}</h1>

      <p className="home-trust">{t("home.trust")}</p>
    </section>
  );
}

export default HomeHero;