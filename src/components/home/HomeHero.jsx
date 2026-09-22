import { useTranslation } from "react-i18next";
import HomeTopBar from "./HomeTopBar";
import "../../styles/ui/primitives.css";

/**
 * Hero da tela inicial: a chamada principal fica ACIMA da barra de acesso, que
 * traz as duas entradas do produto (entrar / criar conta). A ordem e proposital
 * — a frase grande apresenta o produto antes do convite. O formulario so
 * aparece depois do clique.
 */
function HomeHero({ theme, onToggleTheme, onAccess }) {
  const { t } = useTranslation();

  return (
    <section className="home-hero">
      <h1 className="home-title">{t("home.title")}</h1>

      <HomeTopBar theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />
    </section>
  );
}

export default HomeHero;