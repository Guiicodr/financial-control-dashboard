import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";

/**
 * Navbar da tela de login: pilula pequena no topo (mesma linguagem de barra do
 * app) com a marca, as opcoes de acesso e o alternador de tema.
 * As opcoes controlam o formulario exibido logo abaixo, no hero.
 */
function AuthTopBar({ signingUp, onSignIn, onSignUp, theme, onToggleTheme }) {
  const { t } = useTranslation();

  return (
    <header className="auth-topbar">
      <div className="auth-topbar-inner">
        <div className="auth-topbar-brand">
          <span className="auth-topbar-logo" aria-hidden="true">F</span>
          <span className="auth-topbar-name">Finanly.</span>
        </div>

        <div className="auth-topbar-options" role="group" aria-label={t("auth.accessOptions")}>
          <button
            type="button"
            className={"auth-option" + (!signingUp ? " is-active" : "")}
            aria-pressed={!signingUp}
            onClick={onSignIn}
          >
            {t("auth.signIn")}
          </button>
          <button
            type="button"
            className={"auth-option" + (signingUp ? " is-active" : "")}
            aria-pressed={signingUp}
            onClick={onSignUp}
          >
            {t("auth.createAccount")}
          </button>
        </div>

        {onToggleTheme ? <ThemeToggle theme={theme} onToggle={onToggleTheme} compact /> : null}
      </div>
    </header>
  );
}

export default AuthTopBar;