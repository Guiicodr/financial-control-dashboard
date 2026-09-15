import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PeriodSelector from "../components/ui/PeriodSelector";
import ReportComparison from "../components/reports/ReportComparison";
import CategoryBreakdown from "../components/reports/CategoryBreakdown";
import BudgetManager from "../components/reports/BudgetManager";
import ProjectionChart from "../components/reports/ProjectionChart";
import { buscarProjecaoSaldo, criarOrcamento, listarOrcamentos } from "../services/api";
import { pushToast } from "../lib/toast";
import { buildMonthlySeries, expensesByCategory } from "../lib/finance";
import { currentMonthKey, formatCurrency, formatMonthYear } from "../lib/format";
import "../styles/pages/reports.css";

const PERIOD_OPTIONS = [3, 6, 12];
const PROJECTION_MONTHS = 6;

/**
 * Relatorios: comparativo mensal, gastos por categoria, limites de orcamento e
 * projecao de saldo calculada pelo servidor. Todos os numeros vem de dados reais.
 */
function Reports({ transacoes, rendas, theme }) {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState(6);
  const [budgets, setBudgets] = useState([]);
  const [projection, setProjection] = useState([]);
  const [loadingProjection, setLoadingProjection] = useState(true);
  const [savingBudget, setSavingBudget] = useState(false);

  const monthKey = currentMonthKey();

  useEffect(() => {
    let ativo = true;
    buscarProjecaoSaldo(PROJECTION_MONTHS)
      .then((data) => {
        if (ativo) setProjection(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (ativo) setProjection([]);
      })
      .finally(() => {
        if (ativo) setLoadingProjection(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    listarOrcamentos()
      .then((data) => {
        if (ativo) setBudgets(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (ativo) setBudgets([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const series = useMemo(
    () => buildMonthlySeries({ rendas: rendas, transacoes: transacoes, months: period, endMonth: monthKey }),
    [rendas, transacoes, period, monthKey],
  );

  const categories = useMemo(() => expensesByCategory(transacoes, monthKey), [transacoes, monthKey]);

  const summary = useMemo(() => {
    const valid = series || [];
    if (valid.length === 0) return null;
    const totals = valid.reduce(
      (acc, item) => ({
        income: acc.income + item.income,
        expenses: acc.expenses + item.expenses,
      }),
      { income: 0, expenses: 0 },
    );
    return {
      averageIncome: totals.income / valid.length,
      averageExpenses: totals.expenses / valid.length,
      result: totals.income - totals.expenses,
    };
  }, [series]);

  function salvarLimite(orcamento) {
    setSavingBudget(true);
    return criarOrcamento(orcamento)
      .then(() => listarOrcamentos())
      .then((data) => {
        setBudgets(Array.isArray(data) ? data : []);
        pushToast(t("reports.limitSaved"));
      })
      .catch((error) =>
        pushToast(error && error.message ? error.message : t("reports.limitError"), "danger"),
      )
      .finally(() => setSavingBudget(false));
  }

  return (
    <div className="reports-page">
      <header className="page-head">
        <div>
          <span className="dashboard-kicker">{t("reports.kicker")}</span>
          <h1 className="page-title">{t("reports.title")}</h1>
          <p className="dashboard-subtitle">
            {t("reports.subtitle", { period: formatMonthYear(monthKey, i18n.language) })}
          </p>
        </div>
        <PeriodSelector
          label={t("reports.periodLabel")}
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS.map((value) => ({ value: value, label: t("reports.months", { count: value }) }))}
        />
      </header>

      {summary ? (
        <section className="reports-summary">
          <article className="reports-chip">
            <span>{t("reports.averageIncome")}</span>
            <strong>{formatCurrency(summary.averageIncome, i18n.language)}</strong>
          </article>
          <article className="reports-chip">
            <span>{t("reports.averageExpenses")}</span>
            <strong>{formatCurrency(summary.averageExpenses, i18n.language)}</strong>
          </article>
          <article className="reports-chip">
            <span>{t("reports.periodResult")}</span>
            <strong className={summary.result >= 0 ? "is-positive" : "is-negative"}>
              {formatCurrency(summary.result, i18n.language)}
            </strong>
          </article>
        </section>
      ) : null}

      <div className="reports-grid">
        <ReportComparison series={series} theme={theme} />
        <CategoryBreakdown categories={categories} periodLabel={formatMonthYear(monthKey, i18n.language)} />
        <BudgetManager
          budgets={budgets}
          transacoes={transacoes}
          monthKey={monthKey}
          onSave={salvarLimite}
          saving={savingBudget}
        />
        <ProjectionChart projection={projection} theme={theme} loading={loadingProjection} />
      </div>
    </div>
  );
}

export default Reports;

