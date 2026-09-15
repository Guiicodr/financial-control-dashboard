import { useTranslation } from "react-i18next";

/**
 * Hero da tela de login: nome do produto, slogan e chamada de apoio.
 * O fundo Aurora fica na AuthPage, atras de todo o conteudo.
 */
function AuthHero() {
  const { t } = useTranslation();

  return (
    <section className="auth-hero">
      <h1 className="auth-hero-title">Finanly</h1>
      <p className="auth-hero-slogan">{t("brand.tagline")}</p>
      <p className="auth-hero-text">{t("auth.headline")}</p>
    </section>
  );
}

export default AuthHero;