import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCompactCurrency, formatCurrency, formatMonthShort } from "../../lib/format";
import { chartTokens } from "../../lib/chartTheme";
import "../../styles/pages/reports.css";

/**
 * Projecao de saldo calculada pelo servidor (GET /projecoes/saldo): receitas BASE
 * recorrentes e media real de despesas. Nao e simulacao do front.
 */
function ProjectionChart({ projection, theme, loading }) {
  const { t, i18n } = useTranslation();
  const tokens = chartTokens(theme);
  const raw = projection || [];
  const data = raw.map((item) => ({
    label: formatMonthShort(String(item.mes), i18n.language),
    saldo: Number(item.saldoProjetado || 0),
  }));

  const last = data[data.length - 1];
  const negative = data.some((item) => item.saldo < 0);

  return (
    <Card className="report-block">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("reports.projection")}</span>
          <p className="card-subtitle">{t("reports.projectionHint")}</p>
        </div>
        {last && !loading ? (
          <div className="projection-target">
            <span>{t("reports.projected")}</span>
            <strong className={last.saldo >= 0 ? "is-positive" : "is-negative"}>
              {formatCurrency(last.saldo, i18n.language)}
            </strong>
          </div>
        ) : null}
      </div>

      {loading ? (
        <p className="report-loading">{t("common.loading")}</p>
      ) : data.length === 0 ? (
        <EmptyState title={t("common.noData")} description={t("reports.projectionEmpty")} />
      ) : (
        <>
          <div className="report-chart">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="projectionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={tokens.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={tokens.grid} vertical={false} />
                <XAxis dataKey="label" stroke={tokens.axis} tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke={tokens.axis} tickLine={false} axisLine={false} fontSize={11} width={72} tickFormatter={(value) => formatCompactCurrency(value, i18n.language)} />
                <Tooltip
                  contentStyle={{
                    background: tokens.tooltipBg,
                    border: "1px solid " + tokens.tooltipBorder,
                    borderRadius: 12,
                    color: tokens.text,
                    fontSize: 12,
                  }}
                  formatter={(value) => [formatCurrency(value, i18n.language), t("reports.projected")]}
                />
                <Area type="monotone" dataKey="saldo" stroke={tokens.accent} strokeWidth={2} fill="url(#projectionFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {negative ? <p className="report-warning">{t("reports.projectionNegative")}</p> : null}
        </>
      )}
    </Card>
  );
}

export default ProjectionChart;

