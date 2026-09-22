import { useTranslation } from "react-i18next";
import HomeHero from "./HomeHero";
import LegalLinks from "../legal/LegalLinks";
import "../../styles/pages/home.css";

/**
 * Primeira tela do produto para quem nao esta autenticado: hero em uma unica
 * viewport, sobre o fundo Aurora. As telas de acesso (entrar / criar conta)
 * so aparecem quando a pessoa escolhe uma das acoes.
 *
 * A Aurora NAO e montada aqui: ela vive uma unica vez no App (area publica),
 * para o canvas WebGL nao ser recriado a cada troca entre inicio e acesso — era
 * exatamente isso que dava o engasgo na transicao. Aqui o container fica
 * transparente e entra com a animacao leve de troca de tela (.view-enter).
 *
 * O rodape leva aos documentos legais: quem chega sem conta precisa conseguir
 * ler os Termos e o Aviso de Privacidade ANTES de se cadastrar (LGPD art. 9).
 */
function HomePage({ theme = "dark", onToggleTheme, onAccess, onOpenLegal = () => {} }) {
  const { t } = useTranslation();

  return (
    <main className="home-container view-enter">
      <HomeHero theme={theme} onToggleTheme={onToggleTheme} onAccess={onAccess} />
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Finanly. {t("auth.rights")}</p>
        <LegalLinks onOpen={onOpenLegal} />
      </footer>
    </main>
  );
}

export default HomePage;