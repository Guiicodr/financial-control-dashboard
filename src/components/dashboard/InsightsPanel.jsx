import { FaArrowTrendUp, FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { formatCurrency, formatPercent } from "../../lib/format";
function insightIcon(tone) {
  if (tone === "positive") return <FaArrowTrendUp />;
  if (tone === "warning" || tone === "danger") return <FaTriangleExclamation />;
  return <FaCircleInfo />;
}

/**
 * Insights derivados apenas de dados reais (lib/finance.buildInsights).
 * Quando nao ha base de comparacao o insight simplesmente nao existe.
 */
function InsightsPanel({ insights }) {
  const { t, i18n } = useTranslation();
  const list = Array.isArray(insights) ? insights : [];
  if (list.length === 0) return null;

  const textFor = (item) => {
    const percent = formatPercent(item.value !== undefined ? item.value : item.share !== undefined ? item.share : item.usage, i18n.language);
    switch (item.kind) {
      case "expense-trend":
        return item.tone === "warning"
          ? t("dashboard.insightExpenseUp", { percent: percent })
          : t("dashboard.insightExpenseDown", { percent: percent });
      case "top-category":
        return t("dashboard.insightTopCategory", { category: t("categories." + item.category), percent: percent });
      case "income-usage":
        return t("dashboard.insightUsage", { percent: percent });
      case "balance-trend":
        return item.tone === "positive"
          ? t("dashboard.insightBalanceUp", { percent: percent })
          : t("dashboard.insightBalanceDown", { percent: percent });
      case "allocated":
        return t("dashboard.insightAllocated", {
          investment: formatCurrency(item.investment, i18n.language),
          reserve: formatCurrency(item.reserve, i18n.language),
        });
      case "budget":
        return item.tone === "danger"
          ? t("dashboard.insightBudgetDanger", { category: t("categories." + item.category), percent: percent })
          : t("dashboard.insightBudgetWarning", { category: t("categories." + item.category), percent: percent });
      default:
        return "";
    }
  };

  return (
    <Card className="insights-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("dashboard.insights")}</span>
          <p className="card-subtitle">{t("dashboard.insightsHint")}</p>
        </div>
      </div>

      <ul className="insights-list">
        {list.map((item) => (
          <li key={item.id} className={"insight insight--" + item.tone}>
            <span className="insight-icon" aria-hidden="true">{insightIcon(item.tone)}</span>
            <span>{textFor(item)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default InsightsPanel;

