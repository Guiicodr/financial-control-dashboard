import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaPen } from "react-icons/fa6";
import Card from "../ui/Card";
import { formatCurrency, formatPercent } from "../../lib/format";
import { CATEGORY_COLORS, EXPENSE_CATEGORIES, expensesByCategory } from "../../lib/finance";
import "../../styles/pages/reports.css";

/**
 * Limites de orcamento por categoria (entidade Orcamento da API). O uso
 * exibido e o gasto real do mes; ao definir um limite, o servidor passa a
 * emitir os alertas usados no dashboard e no painel de insights.
 */
function BudgetManager({ budgets, transacoes, monthKey, onSave, saving }) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const limits = new Map((budgets || []).map((item) => [item.categoria, Number(item.limiteMensal || 0)]));
  const usage = new Map(expensesByCategory(transacoes, monthKey).map((item) => [item.category, item.value]));

  const extra = [];
  limits.forEach((item, categoria) => {
    if (EXPENSE_CATEGORIES.indexOf(categoria) === -1 && extra.indexOf(categoria) === -1) extra.push(categoria);
  });
  const rows = EXPENSE_CATEGORIES.concat(extra);

  function startEdit(categoria) {
    setEditing(categoria);
    setValue(limits.has(categoria) ? String(limits.get(categoria)) : "");
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    const parsed = Number(String(value).replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError(t("reports.limitError"));
      return;
    }
    setError("");
    Promise.resolve(onSave({ categoria: editing, limiteMensal: parsed })).then(() => {
      setEditing(null);
      setValue("");
    });
  }

  return (
    <Card className="report-block">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("reports.budgets")}</span>
          <p className="card-subtitle">{t("reports.budgetsHint")}</p>
        </div>
      </div>

      <ul className="budget-list">
        {rows.map((categoria) => {
          const limite = limits.get(categoria) || 0;
          const usado = usage.get(categoria) || 0;
          const pct = limite > 0 ? (usado / limite) * 100 : 0;
          const tone = pct >= 100 ? "danger" : pct >= 80 ? "warning" : "ok";
          const aberto = editing === categoria;

          return (
            <li key={categoria} className="budget-row">
              <div className="budget-top">
                <span className="category-name">
                  <span className="category-dot" style={{ background: CATEGORY_COLORS[categoria] || CATEGORY_COLORS.OUTROS }} aria-hidden="true" />
                  {t("categories." + categoria)}
                </span>
                {limite > 0 ? (
                  <span className="budget-values">
                    <strong>{formatCurrency(usado, i18n.language)}</strong>
                    <em>{t("reports.ofLimit", { value: formatCurrency(limite, i18n.language) })}</em>
                  </span>
                ) : (
                  <span className="budget-empty">{t("reports.noBudget")}</span>
                )}
              </div>

              {limite > 0 && !aberto ? (
                <div className="budget-bar-row">
                  <div className="budget-bar">
                    <span className={"budget-fill budget-fill--" + tone} style={{ width: Math.min(pct, 100) + "%" }} />
                  </div>
                  <span className={"budget-pct budget-pct--" + tone}>{formatPercent(pct, i18n.language, 0)}</span>
                </div>
              ) : null}

              {aberto ? (
                <form className="budget-form" onSubmit={submit}>
                  <label className="field">
                    <span>{t("reports.limit")}</span>
                    <input
                      inputMode="decimal"
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      placeholder="0,00"
                      autoFocus
                    />
                  </label>
                  <div className="budget-form-actions">
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>
                      {t("common.cancel")}
                    </button>
                    <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                      <FaCheck /> {saving ? t("common.saving") : t("reports.saveLimit")}
                    </button>
                  </div>
                  {error ? <em className="field-error">{error}</em> : null}
                </form>
              ) : (
                <button type="button" className="btn btn--ghost btn--sm budget-edit" onClick={() => startEdit(categoria)}>
                  <FaPen /> {limite > 0 ? t("reports.editLimit") : t("reports.setLimit")}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default BudgetManager;

