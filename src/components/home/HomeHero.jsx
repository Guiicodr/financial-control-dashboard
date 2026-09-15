import { useTranslation } from "react-i18next";
import "../../styles/ui/primitives.css";

/**
 * Hero da tela inicial: selo do produto, chamada principal e as duas acoes
 * de acesso (criar conta / entrar). O formulario so aparece depois do clique.
 */
function HomeHero({ onAccess }) {
  const { t } = useTranslation();

  return (
    <section className="home-hero">
      <span className="home-badge">
        <span className="home-badge-dot" aria-hidden="true" />
        {t("brand.tagline")}
      </span>

      <h1 className="home-title">{t("home.title")}</h1>
      <p className="home-subtitle">{t("home.subtitle")}</p>

      <div className="home-actions">
        <button type="button" className="btn btn--primary" onClick={() => onAccess("cadastro")}>
          {t("auth.createAccount")}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => onAccess("entrar")}>
          {t("auth.signIn")}
        </button>
      </div>

      <p className="home-trust">{t("home.trust")}</p>
    </section>
  );
}

export default HomeHero;