import { useTranslation } from "react-i18next";
import { FaArrowRight, FaCircleInfo, FaLightbulb, FaTriangleExclamation } from "react-icons/fa6";
import { rotuloDaAcao, textoDaDica, tomDaDica } from "../../lib/gamification";
import Card from "../ui/Card";
import "../../styles/ui/gamification.css";

/** Icone por tom, na mesma linguagem do painel de insights do dashboard. */
function iconeDoTom(tom) {
  if (tom === "danger" || tom === "warning") return <FaTriangleExclamation />;
  if (tom === "positive") return <FaLightbulb />;
  return <FaCircleInfo />;
}

/**
 * Mentora: poucas dicas, da mais urgente para a menos.
 *
 * O texto e montado no i18n do app a partir dos PARAMETROS que o servidor envia
 * (categoria, percentual, dias, valor). Quando a frase vem marcada como gerada
 * (`mensagemGerada`), ela e exibida como veio — nesse caso o valor esta na redacao.
 * Essa regra vive em lib/gamification.js, para o componente nao precisar conhece-la.
 *
 * Cada dica traz a acao sugerida e leva para a tela onde a acao acontece: dica sem
 * caminho de execucao e so um aviso a mais.
 */
function MentorCard({ dicas = [], onNavigate }) {
  const { t } = useTranslation();
  const lista = Array.isArray(dicas) ? dicas : [];

  return (
    <Card className="mentor-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("gamification.mentor.title")}</span>
          <p className="card-subtitle">{t("gamification.mentor.subtitle")}</p>
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="mentor-empty">{t("gamification.mentor.empty")}</p>
      ) : (
        <ul className="mentor-list">
          {lista.map((dica) => (
            <li key={dica.codigo} className={"mentor-tip mentor-tip--" + tomDaDica(dica)}>
              <span className="mentor-icon" aria-hidden="true">{iconeDoTom(tomDaDica(dica))}</span>
              <span className="mentor-text">{textoDaDica(t, dica)}</span>
              {onNavigate && dica.acao ? (
                <button type="button" className="mentor-action" onClick={() => onNavigate(dica.acao)}>
                  {rotuloDaAcao(t, dica.acao)} <FaArrowRight />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default MentorCard;
