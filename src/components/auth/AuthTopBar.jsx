import { useTranslation } from "react-i18next";
import PillBar from "../ui/PillBar";
import PillBarBrand from "../ui/PillBarBrand";
import ThemeToggle from "../ui/ThemeToggle";

/**
 * Navbar da tela de acesso: pilula pequena no topo (mesma linguagem de barra do
 * app) com a marca, as opcoes de acesso e o alternador de tema.
 * A marca volta para a tela inicial e as opcoes controlam o formulario abaixo.
 */
function AuthTopBar({ signingUp, onSignIn, onSignUp, onHome, theme, onToggleTheme }) {
  const { t } = useTranslation();

  return (
    <PillBar
      wide
      brand={<PillBarBrand onClick={onHome} label={t("home.backHome")} />}
      actions={onToggleTheme ? <ThemeToggle theme={theme} onToggle={onToggleTheme} compact /> : null}
    >
      <div className="pill-bar-options" role="group" aria-label={t("auth.accessOptions")}>
        <button
          type="button"
          className={"pill-bar-option" + (!signingUp ? " is-active" : "")}
          aria-pressed={!signingUp}
          onClick={onSignIn}
        >
          {t("auth.signIn")}
        </button>
        <button
          type="button"
          className={"pill-bar-option" + (signingUp ? " is-active" : "")}
          aria-pressed={signingUp}
          onClick={onSignUp}
        >
          {t("auth.createAccount")}
        </button>
      </div>
    </PillBar>
  );
}

export default AuthTopBar;