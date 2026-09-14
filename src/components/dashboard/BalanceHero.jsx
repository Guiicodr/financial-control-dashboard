import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import TrendBadge from "../ui/TrendBadge";
import EmptyState from "../ui/EmptyState";
import { chartTokens } from "../../lib/chartTheme";
import { formatCompactCurrency, formatCurrency } from "../../lib/format";
import "../../styles/pages/dashboard.css";

/** Card principal: saldo disponivel (valor real da API) + evolucao real. */
function BalanceHero({ balance, series, delta, theme }) {
  const { t, i18n } = useTranslation();
  const tokens = chartTokens(theme);
  const hasSeries = Array.isArray(series) && series.length > 0;

  return (
    <Card padding="lg" className="balance-hero">
      <header className="balance-hero-head">
        <div>
          <span className="card-kicker">{t("dashboard.balanceAvailable")}</span>
          <p className="balance-hero-value">{formatCurrency(balance, i18n.language)}</p>
        </div>
        <TrendBadge value={delta} />
      </header>

      <div className="balance-hero-chart">
        {hasSeries ? (
          <ResponsiveContainer width="100%" height={168}>
            <AreaChart data={series} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tokens.accent} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={tokens.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke={tokens.axis}
                tickLine={false}
                axisLine={false}
                fontSize={10}
              />
              <YAxis
                stroke={tokens.axis}
                tickLine={false}
                axisLine={false}
                width={48}
                fontSize={10}
                tickFormatter={(value) => formatCompactCurrency(value, i18n.language)}
              />
              <Tooltip
                contentStyle={{
                  background: tokens.tooltipBg,
                  border: "1px solid " + tokens.tooltipBorder,
                  borderRadius: 12,
                  color: tokens.text,
                  fontSize: 12,
                }}
                labelStyle={{ color: tokens.muted, fontSize: 11 }}
                formatter={(value) => [formatCurrency(value, i18n.language), t("dashboard.balance")]}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={tokens.accent}
                strokeWidth={2}
                fill="url(#balanceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title={t("dashboard.noHistory")} description={t("dashboard.noHistoryHint")} />
        )}
      </div>
    </Card>
  );
}

export default BalanceHero;

