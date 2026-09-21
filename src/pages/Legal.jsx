import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ui/ThemeToggle";
import PillBar from "../components/ui/PillBar";
import PillBarBrand from "../components/ui/PillBarBrand";
import LegalLinks from "../components/legal/LegalLinks";
import {
  CONTROLADOR,
  ENCARREGADO,
  LEGAL_UPDATED_AT,
  LEGAL_VERSION,
  OPERADORES,
  PRAZO_RESPOSTA_DIAS,
} from "../lib/legal";
import "../styles/pages/legal.css";

/**
 * Termos de Uso e Aviso de Privacidade, nas telas publicas.
 *
 * O texto vive no i18n (chave "legal"), os dados do controlador/encarregado e a
 * versao vivem em lib/legal.js. Como as secoes vem do dicionario como objetos, a
 * interpolacao dos {{campos}} e feita aqui — o i18next nao interpola strings
 * aninhadas quando o retorno e um array de objetos.
 */
function interpolacao(chave) {
  const valores = {
    email: ENCARREGADO.email,
    nome: CONTROLADOR.nome,
    documento: CONTROLADOR.documento,
    endereco: CONTROLADOR.endereco,
    foro: CONTROLADOR.foro,
    operadores: OPERADORES.join("; "),
    version: LEGAL_VERSION,
    updatedAt: LEGAL_UPDATED_AT,
    dias: String(PRAZO_RESPOSTA_DIAS),
  };
  return valores[chave] === undefined ? "" : valores[chave];
}

function preencher(texto) {
  return String(texto).replace(/\{\{(\w+)\}\}/g, (original, chave) => {
    const valor = interpolacao(chave);
    return valor === "" ? original : valor;
  });
}

function Legal({ documento = "termos", theme = "dark", onToggleTheme, onBack, onOpen }) {
  const { t } = useTranslation();
  const atual = documento === "privacidade" ? "privacy" : "terms";
  const doc = t(`legal.${atual}`, { returnObjects: true });
  const secoes = Array.isArray(doc.sections) ? doc.sections : [];

  return (
    <main className="legal-container">
      <PillBar
        wide
        brand={<PillBarBrand onClick={onBack} label={t("legal.back")} />}
        actions={onToggleTheme ? <ThemeToggle theme={theme} onToggle={onToggleTheme} compact /> : null}
      >
        <div className="pill-bar-options" role="group" aria-label={t("legal.tabsLabel")}>
          {["terms", "privacy"].map((chave) => (
            <button
              key={chave}
              type="button"
              className={"pill-bar-option" + (atual === chave ? " is-active" : "")}
              aria-pressed={atual === chave}
              onClick={() => onOpen(chave === "terms" ? "termos" : "privacidade")}
            >
              {t(`legal.${chave}.tab`)}
            </button>
          ))}
        </div>
      </PillBar>

      <article className="legal-page">
        <header className="legal-head">
          <span className="page-kicker">{t("legal.kicker")}</span>
          <h1 className="legal-title">{doc.title}</h1>
          <p className="legal-subtitle">{doc.subtitle}</p>
          <p className="legal-version">
            {t("legal.version", { version: LEGAL_VERSION, updatedAt: LEGAL_UPDATED_AT })}
          </p>
        </header>

        <aside className="legal-identity">
          <p>
            <strong>{t("legal.controllerLabel")}: </strong>
            {t("legal.controllerBody", CONTROLADOR)}
          </p>
          <p>
            <strong>{t("legal.dpoLabel")}: </strong>
            {t("legal.dpoBody", ENCARREGADO)}
          </p>
          <p className="legal-hint">{t("legal.dpoHint", { dias: PRAZO_RESPOSTA_DIAS })}</p>
        </aside>

        {secoes.map((secao) => (
          <section key={secao.title} className="legal-section">
            <h2 className="legal-section-title">{secao.title}</h2>
            {(secao.paragraphs || []).map((paragrafo, indice) => (
              <p key={paragrafo.slice(0, 24) + indice}>{preencher(paragrafo)}</p>
            ))}
          </section>
        ))}

        {atual === "privacy" ? (
          <section className="legal-section">
            <h2 className="legal-section-title">{t("legal.operatorsLabel")}</h2>
            <ul className="legal-list">
              {OPERADORES.map((operador) => (
                <li key={operador}>{operador}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <LegalLinks onOpen={onOpen} className="legal-footer-links" />
      </article>
    </main>
  );
}

export default Legal;
