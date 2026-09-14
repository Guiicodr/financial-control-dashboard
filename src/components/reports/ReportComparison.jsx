import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import TrendBadge from "../ui/TrendBadge";
import { formatCurrency, formatMonthShort } from "../../lib/format";
import { percentChange } from "../../lib/finance";
import { chartTokens } from "../../lib/chartTheme";
import "../../styles/pages/reports.css";

/** Comparativo mensal real: receitas x despesas por mes + resultado do periodo. */
function ReportComparison({ series, theme }) {
  const { t, i18n } = useTranslation();
  const tokens = chartTokens(theme);
  const data = (series || []).map((item) => ({
    key: item.key,
    label: formatMonthShort(item.key + "-01", i18n.language),
    receitas: item.income,
    despesas: item.expenses,
  }));

  const totals = (series || []).reduce(
    (acc, item) => ({
      income: acc.income + item.income,
      expenses: acc.expenses + item.expenses,
      net: acc.net + item.net,
    }),
    { income: 0, expenses: 0, net: 0 },
  );

  const last = (series || [])[(series || []).length - 1] || { income: 0, expenses: 0 };
  const beforeLast = (series || [])[(series || []).length - 2] || { income: 0, expenses: 0 };

  if (!series || series.length === 0) {
    return (
      <Card className="report-block">
        <div className="card-head">
          <span className="card-kicker">{t("reports.comparison")}</span>
        </div>
        <EmptyState title={t("common.noData")} description={t("reports.comparisonEmpty")} />
      </Card>
    );
  }

  return (
    <Card className="report-block">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("reports.comparison")}</span>
          <p className="card-subtitle">{t("reports.comparisonHint")}</p>
        </div>
      </div>

      <div className="report-totals">
        <div className="report-stat">
          <span>{t("dashboard.income")}</span>
          <strong>{formatCurrency(totals.income, i18n.language)}</strong>
          <TrendBadge value={percentChange(last.income, beforeLast.income)} />
        </div>
        <div className="report-stat">
          <span>{t("dashboard.expenses")}</span>
          <strong>{formatCurrency(totals.expenses, i18n.language)}</strong>
          <TrendBadge value={percentChange(last.expenses, beforeLast.expenses)} invert />
        </div>
        <div className="report-stat">
          <span>{t("reports.netResult")}</span>
          <strong className={totals.net >= 0 ? "is-positive" : "is-negative"}>{formatCurrency(totals.net, i18n.language)}</strong>
        </div>
      </div>

      <div className="report-chart">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barGap={6}>
            <CartesianGrid stroke={tokens.grid} vertical={false} />
            <XAxis dataKey="label" stroke={tokens.axis} tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke={tokens.axis} tickLine={false} axisLine={false} fontSize={11} width={70} tickFormatter={(value) => formatCurrency(value, i18n.language, 0)} />
            <Tooltip
              cursor={{ fill: tokens.grid }}
              contentStyle={{
                background: tokens.tooltipBg,
                border: "1px solid " + tokens.tooltipBorder,
                borderRadius: 12,
                color: tokens.text,
                fontSize: 12,
              }}
              formatter={(value) => formatCurrency(value, i18n.language)}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: tokens.text }} />
            <Bar dataKey="receitas" name={t("dashboard.income")} fill={tokens.income} radius={[6, 6, 0, 0]} />
            <Bar dataKey="despesas" name={t("dashboard.expenses")} fill={tokens.expense} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ReportComparison;

