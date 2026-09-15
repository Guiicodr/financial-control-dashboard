import { useTranslation } from "react-i18next";
import PillBar from "../ui/PillBar";
import PillBarBrand from "../ui/PillBarBrand";
import ThemeToggle from "../ui/ThemeToggle";
import "../../styles/ui/primitives.css";

/**
 * Barra da tela inicial: marca a esquerda e, a direita, o alternador de tema
 * com as duas entradas do produto (entrar e criar conta).
 */
function HomeTopBar({ theme, onToggleTheme, onAccess }) {
  const { t } = useTranslation();

  return (
    <PillBar
      brand={<PillBarBrand />}
      actions={
        <>
          {onToggleTheme ? <ThemeToggle theme={theme} onToggle={onToggleTheme} compact /> : null}
          <button type="button" className="btn btn--ghost" onClick={() => onAccess("entrar")}>
            {t("auth.signIn")}
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onAccess("cadastro")}>
            {t("auth.createAccount")}
          </button>
        </>
      }
    />
  );
}

export default HomeTopBar;