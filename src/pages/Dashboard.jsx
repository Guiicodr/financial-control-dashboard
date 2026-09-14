import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowTrendUp, FaArrowTrendDown, FaBriefcase, FaBullseye } from "react-icons/fa6";
import BalanceHero from "../components/dashboard/BalanceHero";
import InvestedCard from "../components/dashboard/InvestedCard";
import MetricGrid from "../components/dashboard/MetricGrid";
import BudgetMeter from "../components/dashboard/BudgetMeter";
import AllocationDonut from "../components/dashboard/AllocationDonut";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import MonthlyReportCard from "../components/dashboard/MonthlyReportCard";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import PeriodSelector from "../components/ui/PeriodSelector";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { listarAlertasOrcamento, listarNotificacoes } from "../services/api";
import {
  GOAL_TYPES,
  balanceAt,
  buildAllocation,
  buildInsights,
  buildMonthlySeries,
  expensesInMonth,
  goalsTotalByType,
  incomeInMonth,
  percentChange,
} from "../lib/finance";
import { currentMonthKey, formatCurrency, formatMonthShort, formatMonthYear, formatPercent, monthRange } from "../lib/format";
import "../styles/pages/dashboard.css";

const PERIOD_OPTIONS = [3, 6, 12];

/**
 * Dashboard: todos os numeros vem da API ou de derivacoes que espelham as
 * regras do backend (lib/finance). Nada e inventado; sem base de comparacao
 * o indicador correspondente simplesmente nao aparece.
 */
function Dashboard({ saldo, transacoes, rendas, objetivos, nomeUsuario, theme, onNewTransaction, onOpenTransactions, onOpenReports }) {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState(6);
  const [budgets, setBudgets] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ativo = true;
    Promise.allSettled([listarAlertasOrcamento(), listarNotificacoes()]).then((resultados) => {
      if (!ativo) return;
      const [orcamentos, avisos] = resultados;
      if (orcamentos.status === "fulfilled") setBudgets(orcamentos.value || []);
      if (avisos.status === "fulfilled") setNotificacoes(avisos.value || []);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const mesAtual = currentMonthKey();
  const mesAnterior = monthRange(2, mesAtual)[0];

  const mesIncome = incomeInMonth(rendas, mesAtual);
  const mesExpenses = expensesInMonth(transacoes, mesAtual);
  const prevIncome = incomeInMonth(rendas, mesAnterior);
  const prevExpenses = expensesInMonth(transacoes, mesAnterior);

  const investimento = goalsTotalByType(objetivos, GOAL_TYPES.INVESTIMENTO);
  const reserva = goalsTotalByType(objetivos, GOAL_TYPES.RESERVA);

  const serie = useMemo(
    () => buildMonthlySeries({ rendas, transacoes, months: period }).map((item) => ({ ...item, label: formatMonthShort(item.key, i18n.language) })),
    [rendas, transacoes, period, i18n.language],
  );

  const allocation = useMemo(
    () => buildAllocation({ rendas, transacoes, objetivos, months: period }),
    [rendas, transacoes, objetivos, period],
  );

  const insights = useMemo(
    () => buildInsights({ rendas, transacoes, objetivos, budgets }),
    [rendas, transacoes, objetivos, budgets],
  );

  const saldoAnterior = balanceAt(rendas, transacoes, mesAnterior);
  const saldoDelta = percentChange(saldo, saldoAnterior);
  const usoRenda = mesIncome > 0 ? (mesExpenses / mesIncome) * 100 : null;

  const greetingKey =
    hour >= 5 && hour < 12
      ? "dashboard.greetingMorning"
      : hour < 18
        ? "dashboard.greetingAfternoon"
        : "dashboard.greetingEvening";

  const notas = t("dashboard.hourlyNotes", { returnObjects: true });
  const notaHora = Array.isArray(notas) ? notas[hour] || "" : "";

  const metricas = [
    {
      id: "income",
      label: t("dashboard.income"),
      value: formatCurrency(mesIncome, i18n.language),
      tone: "income",
      icon: <FaArrowTrendUp />,
      delta: percentChange(mesIncome, prevIncome),
      hint: t("dashboard.prevMonth"),
    },
    {
      id: "expenses",
      label: t("dashboard.expenses"),
      value: formatCurrency(mesExpenses, i18n.language),
      tone: "expense",
      icon: <FaArrowTrendDown />,
      delta: percentChange(mesExpenses, prevExpenses),
      hint: t("dashboard.prevMonth"),
    },
    {
      id: "investment",
      label: t("dashboard.investments"),
      value: formatCurrency(investimento, i18n.language),
      tone: "investment",
      icon: <FaBriefcase />,
      hint: t("dashboard.fromGoals"),
    },
    {
      id: "reserve",
      label: t("dashboard.reserve"),
      value: formatCurrency(reserva, i18n.language),
      tone: "reserve",
      icon: <FaBullseye />,
      hint: t("dashboard.fromGoals"),
    },
    {
      id: "usage",
      label: t("dashboard.incomeUsage"),
      value: usoRenda === null ? t("common.noData") : formatPercent(usoRenda, i18n.language),
      tone: "accent",
      hint: t("dashboard.ofIncome"),
    },
  ];

  return (
    <>
      <header className="dashboard-header">
        <div>
          <span className="dashboard-kicker">{t("dashboard.overviewKicker")}</span>
          <h1 className="dashboard-title">{t(greetingKey, { name: nomeUsuario })}</h1>
          <p className="dashboard-subtitle">
            {t("dashboard.summaryOf", { period: formatMonthYear(mesAtual, i18n.language) })}
          </p>
          {notaHora ? <p className="hero-note">{notaHora}</p> : null}
        </div>

        <div className="dashboard-toolbar">
          <PeriodSelector
            label={t("dashboard.period")}
            value={period}
            onChange={setPeriod}
            options={PERIOD_OPTIONS.map((value) => ({ value: value, label: t("dashboard.months", { count: value }) }))}
          />
          <button type="button" className="btn btn--primary" onClick={onNewTransaction}>
            {t("dashboard.newTransaction")}
          </button>
        </div>
      </header>

      <div className="dashboard-hero-grid">
        <BalanceHero balance={saldo} series={serie} delta={saldoDelta} theme={theme} />
        <InvestedCard investment={investimento} reserve={reserva} income={mesIncome} />
      </div>

      <MetricGrid items={metricas} />

      <div className="dashboard-panels">
        <BudgetMeter expenses={mesExpenses} budgets={budgets} />
        <AllocationDonut allocation={allocation} theme={theme} />
      </div>

      <div className="dashboard-panels dashboard-panels--split">
        <RecentTransactions transacoes={transacoes} onSeeAll={onOpenTransactions} />
        <div className="dashboard-side">
          <MonthlyReportCard
            current={{ income: mesIncome, expenses: mesExpenses }}
            previous={{ income: prevIncome, expenses: prevExpenses }}
            onOpenReports={onOpenReports}
          />
          <InsightsPanel insights={insights} />
          {notificacoes.length > 0 ? (
            <Card className="alerts-card">
              <div className="card-head">
                <span className="card-kicker">{t("dashboard.alerts")}</span>
              </div>
              <ul className="insights-list">
                {notificacoes.map((item, index) => (
                  <li key={item.tipo + index} className="insight insight--warning">
                    <span>{item.titulo}: {item.mensagem}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
          {transacoes.length === 0 && rendas.length === 0 ? (
            <Card>
              <EmptyState
                title={t("dashboard.noData")}
                description={t("dashboard.noDataMessage")}
              />
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Dashboard;

