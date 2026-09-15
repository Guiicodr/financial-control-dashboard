import { useTranslation } from "react-i18next";

/**
 * Coluna de branding da tela de login: logo, chamada e rodape.
 * O fundo Aurora fica na AuthPage, atras das duas colunas.
 */
function AuthBrandPanel() {
  const { t } = useTranslation();

  return (
    <section className="auth-brand-section">
      <div className="brand-header">
        <span className="brand-logo">Finanly.</span>
      </div>
      <div className="brand-content">
        <h1>{t("auth.headline")}</h1>
        <p>{t("auth.description")}</p>
      </div>
      <div className="brand-footer">
        <p>© {new Date().getFullYear()} Finanly Inc. {t("auth.rights")}</p>
      </div>
    </section>
  );
}

export default AuthBrandPanel;