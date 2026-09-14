import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatPercent } from "../../lib/format";
import "../../styles/pages/reports.css";

/** Gastos reais por categoria no periodo, ordenados do maior para o menor. */
function CategoryBreakdown({ categories, periodLabel }) {
  const { t, i18n } = useTranslation();
  const items = categories || [];
  const max = items.reduce((acc, item) => Math.max(acc, item.value), 0);

  return (
    <Card className="report-block">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("reports.categories")}</span>
          <p className="card-subtitle">{t("reports.categoriesHint", { period: periodLabel })}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title={t("common.noData")} description={t("reports.categoriesEmpty")} />
      ) : (
        <ul className="category-list">
          {items.map((item) => (
            <li key={item.category} className="category-row">
              <div className="category-top">
                <span className="category-name">
                  <span className="category-dot" style={{ background: item.color }} aria-hidden="true" />
                  {t("categories." + item.category)}
                </span>
                <strong>{formatCurrency(item.value, i18n.language)}</strong>
              </div>
              <div className="category-bar">
                <span
                  className="category-fill"
                  style={{ width: (max > 0 ? (item.value / max) * 100 : 0) + "%", background: item.color }}
                />
              </div>
              <span className="category-share">{formatPercent(item.share, i18n.language, 1)} {t("reports.ofExpenses")}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default CategoryBreakdown;

