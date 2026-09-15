import { useTranslation } from "react-i18next";
import AuroraBackground from "../ui/AuroraBackground";
import HomeTopBar from "./HomeTopBar";
import HomeHero from "./HomeHero";
import "../../styles/pages/home.css";

/**
 * Primeira tela do produto para quem nao esta autenticado: hero em uma unica
 * viewport, sobre o fundo Aurora. As telas de acesso (entrar / criar conta)
 * so aparecem quando a pessoa escolhe uma das acoes.
 */
function HomePage({ theme = "dark", onToggleTheme, onAccess }) {
  const { t } = useTranslation();

  return (
    <main className="home-container">
      <AuroraBackground theme={theme} variant="auth" />
      <HomeTopBar theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />
      <HomeHero onAccess={onAccess} />
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Finanly Inc. {t("auth.rights")}</p>
      </footer>
    </main>
  );
}

export default HomePage;