import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatPercent } from "../../lib/format";
import { chartTokens } from "../../lib/chartTheme";
import "../../styles/pages/dashboard.css";

const ALLOCATION_LABELS = {
  income: "dashboard.income",
  investment: "dashboard.investments",
  expenses: "dashboard.expenses",
  reserve: "dashboard.reserve",
};

/** Distribuicao real: receitas, gastos, investimentos e reserva do periodo. */
function AllocationDonut({ allocation, theme }) {
  const { t, i18n } = useTranslation();
  const tokens = chartTokens(theme);
  const { items, total } = allocation || { items: [], total: 0 };

  return (
    <Card className="allocation-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("dashboard.allocation")}</span>
          <p className="card-subtitle">{t("dashboard.allocationHint")}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title={t("common.noData")} description={t("dashboard.allocationEmpty")} />
      ) : (
        <div className="allocation-body">
          <div className="allocation-chart">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={items}
                  dataKey="value"
                  nameKey="id"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={3}
                  stroke="none"
                >
                  {items.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: tokens.tooltipBg,
                    border: "1px solid " + tokens.tooltipBorder,
                    borderRadius: 12,
                    color: tokens.text,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [formatCurrency(value, i18n.language), t(ALLOCATION_LABELS[name] || "dashboard.balance")]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="allocation-center">
              <strong>{formatCurrency(total, i18n.language)}</strong>
              <span>{t("dashboard.total")}</span>
            </div>
          </div>

          <ul className="allocation-legend">
            {items.map((item) => (
              <li key={item.id}>
                <span className="allocation-dot" style={{ background: item.color }} aria-hidden="true" />
                <span className="allocation-name">{t(ALLOCATION_LABELS[item.id] || "dashboard.balance")}</span>
                <strong>{formatPercent(item.share, i18n.language, 0)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default AllocationDonut;

