import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import CategoryBadge from "../ui/CategoryBadge";
import { formatCurrency, formatPercent } from "../../lib/format";
/**
 * Orcamento: despesas do mes contra a soma dos limites reais
 * (GET /orcamentos/alertas). Sem limites definidos nao inventamos meta.
 */
function BudgetMeter({ expenses, budgets }) {
  const { t, i18n } = useTranslation();
  const list = Array.isArray(budgets) ? budgets : [];
  const limit = list.reduce((sum, item) => sum + Number(item.limite || 0), 0);
  const usage = limit > 0 ? (expenses / limit) * 100 : 0;
  const state = usage >= 100 ? "danger" : usage >= 80 ? "warning" : "ok";

  return (
    <Card className="budget-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("dashboard.monthExpenses")}</span>
          <p className="budget-value">{formatCurrency(expenses, i18n.language)}</p>
        </div>
        {limit > 0 ? (
          <span className={"budget-chip budget-chip--" + state}>{formatPercent(usage, i18n.language)}</span>
        ) : null}
      </div>

      {limit > 0 ? (
        <div className="budget-body">
          <div className={"budget-track budget-track--" + state}>
            <span style={{ width: Math.min(usage, 100) + "%" }} />
          </div>
          <p className="budget-foot">
            {t("dashboard.limitOf", { limit: formatCurrency(limit, i18n.language) })}
          </p>
          {list.length > 0 ? (
            <ul className="budget-list">
              {list.map((item) => (
                <li key={item.categoria}>
                  <CategoryBadge category={item.categoria} />
                  <span>{formatPercent(Number(item.percentual || 0), i18n.language)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <EmptyState title={t("dashboard.noBudget")} description={t("dashboard.noBudgetHint")} />
      )}
    </Card>
  );
}

export default BudgetMeter;

