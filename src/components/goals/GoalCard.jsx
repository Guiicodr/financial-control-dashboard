import { useTranslation } from "react-i18next";
import { FaArrowDown, FaArrowUp, FaBullseye, FaTrash } from "react-icons/fa6";
import { formatCurrency, formatDate, formatPercent } from "../../lib/format";
import { goalMonthlyPace, goalProgress, goalStatus } from "../../lib/finance";
import "../../styles/pages/goals.css";

/**
 * Card de meta com progresso real (valorAtual / valorAlvo), status derivado do
 * prazo e ritmo mensal necessario. Aporte e resgate sao movimentos reais.
 */
function GoalCard({ objetivo, onDeposit, onWithdraw, onDelete }) {
  const { t, i18n } = useTranslation();
  const progress = goalProgress(objetivo);
  const status = goalStatus(objetivo);
  const pace = goalMonthlyPace(objetivo);
  const prazo = objetivo.prazo ? String(objetivo.prazo).slice(0, 10) : null;

  return (
    <article className="goal-card">
      <header className="goal-head">
        <div className="goal-identity">
          <span className="goal-icon" aria-hidden="true"><FaBullseye /></span>
          <div>
            <p className="goal-name">{objetivo.nome}</p>
            <span className="goal-type">{t("goals.type" + objetivo.tipo)}</span>
          </div>
        </div>
        <span className={"goal-status goal-status--" + status}>{t("goals.status" + status.charAt(0).toUpperCase() + status.slice(1))}</span>
      </header>

      <div className="goal-values">
        <strong>{formatCurrency(objetivo.valorAtual, i18n.language)}</strong>
        <em>{t("goals.ofTarget", { value: formatCurrency(objetivo.valorAlvo, i18n.language) })}</em>
      </div>

      <div className="goal-bar">
        <span className={"goal-fill goal-fill--" + status} style={{ width: progress + "%" }} />
      </div>

      <div className="goal-meta">
        <span>{formatPercent(progress, i18n.language, 0)} {t("goals.completeLabel")}</span>
        <span>{prazo ? t("goals.deadline", { date: formatDate(prazo, i18n.language) }) : t("goals.noDeadline")}</span>
      </div>

      <p className="goal-pace">
        {pace === null
          ? t("goals.expired")
          : t("goals.paceMonthly", { amount: formatCurrency(pace, i18n.language) })}
      </p>

      <div className="goal-actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={() => onDeposit(objetivo)}>
          <FaArrowUp /> {t("goals.deposit")}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onWithdraw(objetivo)}
          disabled={Number(objetivo.valorAtual || 0) <= 0}
        >
          <FaArrowDown /> {t("goals.withdraw")}
        </button>
        <button
          type="button"
          className="goal-delete"
          onClick={() => onDelete(objetivo)}
          aria-label={t("goals.delete")}
        >
          <FaTrash />
        </button>
      </div>
    </article>
  );
}

export default GoalCard;

