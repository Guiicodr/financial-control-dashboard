import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import TrendBadge from "../ui/TrendBadge";
import { formatCurrency } from "../../lib/format";
import { percentChange } from "../../lib/finance";
/** Comparativo real entre o mes atual e o anterior (receitas e despesas). */
function MonthlyReportCard({ current, previous, onOpenReports }) {
  const { t, i18n } = useTranslation();
  const incomeDelta = percentChange(current.income, previous.income);
  const expenseDelta = percentChange(current.expenses, previous.expenses);

  return (
    <Card className="report-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("dashboard.reports")}</span>
          <p className="card-subtitle">{t("dashboard.reportHint")}</p>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-stat">
          <span>{t("dashboard.income")}</span>
          <strong>{formatCurrency(current.income, i18n.language)}</strong>
          <TrendBadge value={incomeDelta} />
        </div>
        <div className="report-stat">
          <span>{t("dashboard.expenses")}</span>
          <strong>{formatCurrency(current.expenses, i18n.language)}</strong>
          <TrendBadge value={expenseDelta} invert />
        </div>
      </div>

      {onOpenReports ? (
        <button type="button" className="btn btn--ghost report-cta" onClick={onOpenReports}>
          {t("dashboard.openReports")}
        </button>
      ) : null}
    </Card>
  );
}

export default MonthlyReportCard;

