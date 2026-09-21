import { useTranslation } from "react-i18next";
import AuroraBackground from "../ui/AuroraBackground";
import HomeHero from "./HomeHero";
import LegalLinks from "../legal/LegalLinks";
import "../../styles/pages/home.css";

/**
 * Primeira tela do produto para quem nao esta autenticado: hero em uma unica
 * viewport, sobre o fundo Aurora. As telas de acesso (entrar / criar conta)
 * so aparecem quando a pessoa escolhe uma das acoes.
 *
 * O rodape leva aos documentos legais: quem chega sem conta precisa conseguir
 * ler os Termos e o Aviso de Privacidade ANTES de se cadastrar (LGPD art. 9).
 */
function HomePage({ theme = "dark", onToggleTheme, onAccess, onOpenLegal = () => {} }) {
  const { t } = useTranslation();

  return (
    <main className="home-container">
      <AuroraBackground theme={theme} />
      <HomeHero theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Finanly. {t("auth.rights")}</p>
        <LegalLinks onOpen={onOpenLegal} />
      </footer>
    </main>
  );
}

export default HomePage;