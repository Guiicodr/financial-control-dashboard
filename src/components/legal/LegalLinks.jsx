import { useTranslation } from "react-i18next";
import "../../styles/pages/legal.css";

/**
 * Atalho para os dois documentos legais.
 *
 * Aparece no rodape das telas publicas, no bloco de aceite do cadastro e no
 * cartao de privacidade do perfil: sao os pontos onde o titular precisa
 * conseguir ler o texto que esta aceitando ou que rege o uso do servico
 * (LGPD arts. 9 e 18, e dever de informacao).
 */
function LegalLinks({ onOpen, className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={"legal-links" + (className ? " " + className : "")}>
      <button type="button" className="legal-link" onClick={() => onOpen("termos")}>
        {t("legal.terms.title")}
      </button>
      <span className="legal-links-sep" aria-hidden="true">·</span>
      <button type="button" className="legal-link" onClick={() => onOpen("privacidade")}>
        {t("legal.privacy.title")}
      </button>
    </div>
  );
}

export default LegalLinks;
