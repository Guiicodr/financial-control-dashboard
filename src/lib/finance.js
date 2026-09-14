/**
 * Finanly - derivacoes financeiras.
 *
 * REGRA CRITICA: nada aqui inventa dado. Todo calculo replica (em JS) as regras
 * ja implementadas no backend, ou apenas agrega dados reais recebidos da API.
 *
 *   Receitas  => entidade Income (BASE recorrente mensal / EXTRA pontual)
 *   Despesas  => Transacao com tipo === "SAIDA"
 *   Investimento / Reserva => Objetivo com tipo INVESTIMENTO / RESERVA
 *
 * As regras de Income espelham IncomeService.valorNoMes / totalAcumuladoAte.
 */

import { currentMonthKey, monthKeyOf, monthRange, monthsBetween } from "./format";

export const EXPENSE_TYPE = "SAIDA";
export const INCOME_BASE = "BASE";
export const INCOME_EXTRA = "EXTRA";

export const GOAL_TYPES = {
  COMPRA: "COMPRA",
  ECONOMIA: "ECONOMIA",
  INVESTIMENTO: "INVESTIMENTO",
  RESERVA: "RESERVA",
};

export const EXPENSE_CATEGORIES = [
  "ALIMENTACAO",
  "TRANSPORTE",
  "LAZER",
  "ESTUDOS",
  "OUTROS",
];

export const CATEGORY_COLORS = {
  ALIMENTACAO: "#F97316",
  TRANSPORTE: "#38BDF8",
  LAZER: "#A855F7",
  ESTUDOS: "#22C55E",
  SALARIO: "#34D399",
  OUTROS: "#94A3B8",
};

export function isExpense(transacao) {
  return transacao && transacao.tipo === EXPENSE_TYPE;
}

function monthOf(value) {
  if (!value) return null;
  const text = String(value);
  const iso = /^(\d{4})-(\d{2})/.exec(text);
  if (iso) return iso[1] + "-" + iso[2];
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : monthKeyOf(parsed);
}

/* ------------------------- Receitas (Income) ------------------------- */

/** Valor da renda considerando o mes. Igual a IncomeService.valorNoMes. */
export function incomeValueInMonth(renda, monthKey) {
  if (!renda) return 0;
  const valor = Number(renda.valor || 0);
  if (!Number.isFinite(valor)) return 0;
  const data = renda.data ? monthOf(renda.data) : null;

  if (!data) return currentMonthKey() === monthKey ? valor : 0;
  if (renda.tipo === INCOME_BASE) return data > monthKey ? 0 : valor;
  return data === monthKey ? valor : 0;
}

/** Total de receitas de um mes. */
export function incomeInMonth(rendas, monthKey) {
  return (rendas || []).reduce((total, renda) => total + incomeValueInMonth(renda, monthKey), 0);
}

/** Receitas acumuladas ate o mes (renda BASE multiplica pelos meses). */
export function incomeAccumulatedUpTo(rendas, monthKey) {
  return (rendas || []).reduce((total, renda) => {
    const valor = Number(renda && renda.valor ? renda.valor : 0);
    if (!Number.isFinite(valor)) return total;
    const data = renda.data ? monthOf(renda.data) : null;

    if (renda.tipo !== INCOME_BASE || !data) {
      return total + (data === null || data <= monthKey ? valor : 0);
    }

    const meses = monthsBetween(data, monthKey) + 1;
    return total + (meses > 0 ? valor * meses : 0);
  }, 0);
}

/* --------------------- Despesas (Transacao SAIDA) --------------------- */

export function expensesInMonth(transacoes, monthKey) {
  return (transacoes || [])
    .filter((item) => isExpense(item) && monthOf(item.data) === monthKey)
    .reduce((total, item) => total + Number(item.valor || 0), 0);
}

export function expensesUpTo(transacoes, monthKey) {
  return (transacoes || [])
    .filter((item) => {
      const key = monthOf(item.data);
      return isExpense(item) && key !== null && key <= monthKey;
    })
    .reduce((total, item) => total + Number(item.valor || 0), 0);
}

/** Saldo acumulado ate o fim de um mes (mesma semantica do backend). */
export function balanceAt(rendas, transacoes, monthKey) {
  return incomeAccumulatedUpTo(rendas, monthKey) - expensesUpTo(transacoes, monthKey);
}

/* --------------------------- Series mensais --------------------------- */

export function buildMonthlySeries(options) {
  const opts = options || {};
  const rendas = opts.rendas || [];
  const transacoes = opts.transacoes || [];
  const months = opts.months || 6;
  const endMonth = opts.endMonth || currentMonthKey();

  return monthRange(months, endMonth).map((key) => {
    const income = incomeInMonth(rendas, key);
    const expenses = expensesInMonth(transacoes, key);
    return {
      key: key,
      income: income,
      expenses: expenses,
      net: income - expenses,
      balance: balanceAt(rendas, transacoes, key),
    };
  });
}

/** Variacao percentual segura (null quando nao ha base de comparacao). */
export function percentChange(current, previous) {
  const before = Number(previous) || 0;
  const after = Number(current) || 0;
  if (before === 0) return after === 0 ? 0 : null;
  return ((after - before) / Math.abs(before)) * 100;
}

/* --------------------- Agregacoes por categoria --------------------- */

export function expensesByCategory(transacoes, monthKey) {
  const map = new Map();
  (transacoes || [])
    .filter((item) => isExpense(item) && (!monthKey || monthOf(item.data) === monthKey))
    .forEach((item) => {
      const key = item.categoria || "OUTROS";
      map.set(key, (map.get(key) || 0) + Number(item.valor || 0));
    });

  let total = 0;
  map.forEach((value) => { total += value; });

  return Array.from(map.entries())
    .map((entry) => ({
      category: entry[0],
      value: entry[1],
      share: total === 0 ? 0 : (entry[1] / total) * 100,
      color: CATEGORY_COLORS[entry[0]] || CATEGORY_COLORS.OUTROS,
    }))
    .sort((a, b) => b.value - a.value);
}

export function topCategory(transacoes, monthKey) {
  return expensesByCategory(transacoes, monthKey)[0] || null;
}

/* ------------------------------- Metas ------------------------------- */

export function goalProgress(objetivo) {
  const target = Number((objetivo && objetivo.valorAlvo) || 0);
  const current = Number((objetivo && objetivo.valorAtual) || 0);
  if (target <= 0) return 0;
  return Math.min(Math.max((current / target) * 100, 0), 100);
}

/** Soma real de dinheiro alocado por tipo de objetivo. */
export function goalsTotalByType(objetivos, tipo) {
  return (objetivos || [])
    .filter((item) => item.tipo === tipo)
    .reduce((total, item) => total + Number(item.valorAtual || 0), 0);
}

export function goalStatus(objetivo) {
  const progress = goalProgress(objetivo);
  if (progress >= 100) return "done";
  const prazo = objetivo && objetivo.prazo ? String(objetivo.prazo).slice(0, 10) : null;
  const deadline = prazo ? new Date(prazo + "T00:00:00") : null;
  if (deadline && !Number.isNaN(deadline.getTime()) && deadline < new Date()) return "late";
  if (progress >= 75) return "near";
  return "ongoing";
}

/** Quanto guardar por mes para atingir a meta no prazo (so com prazo futuro). */
export function goalMonthlyPace(objetivo) {
  const target = Number((objetivo && objetivo.valorAlvo) || 0);
  const current = Number((objetivo && objetivo.valorAtual) || 0);
  const prazo = objetivo && objetivo.prazo ? String(objetivo.prazo).slice(0, 10) : null;
  const deadline = prazo ? new Date(prazo + "T00:00:00") : null;
  if (!deadline || Number.isNaN(deadline.getTime()) || deadline <= new Date()) return null;
  const months = Math.max(1, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24 * 30)));
  return Math.max(0, target - current) / months;
}

/* ------------------------ Composicao / distribuicao ------------------------ */

export function buildAllocation(options) {
  const opts = options || {};
  const rendas = opts.rendas || [];
  const transacoes = opts.transacoes || [];
  const objetivos = opts.objetivos || [];
  const months = opts.months || 1;
  const endMonth = opts.endMonth || currentMonthKey();

  const keys = monthRange(months, endMonth);
  let income = 0;
  let expenses = 0;
  keys.forEach((key) => {
    income += incomeInMonth(rendas, key);
    expenses += expensesInMonth(transacoes, key);
  });

  const investment = goalsTotalByType(objetivos, GOAL_TYPES.INVESTIMENTO);
  const reserve = goalsTotalByType(objetivos, GOAL_TYPES.RESERVA);

  const items = [
    { id: "income", value: income, color: "#7C5CFF" },
    { id: "investment", value: investment, color: "#E8B44A" },
    { id: "expenses", value: expenses, color: "#34D399" },
    { id: "reserve", value: reserve, color: "#F472B6" },
  ].filter((item) => item.value > 0);

  let total = 0;
  items.forEach((item) => { total += item.value; });
  if (total <= 0) return { total: 0, items: [] };

  return {
    total: total,
    items: items.map((item) => ({ id: item.id, value: item.value, color: item.color, share: (item.value / total) * 100 })),
  };
}

/* ------------------------------- Insights ------------------------------- */

export function buildInsights(options) {
  const opts = options || {};
  const rendas = opts.rendas || [];
  const transacoes = opts.transacoes || [];
  const objetivos = opts.objetivos || [];
  const budgets = opts.budgets || [];
  const insights = [];

  const current = currentMonthKey();
  const previous = monthRange(2, current)[0];

  const currentExpenses = expensesInMonth(transacoes, current);
  const previousExpenses = expensesInMonth(transacoes, previous);
  const currentIncome = incomeInMonth(rendas, current);

  const expenseDelta = percentChange(currentExpenses, previousExpenses);
  if (expenseDelta !== null && previousExpenses > 0 && Math.abs(expenseDelta) >= 1) {
    insights.push({
      id: "expense-trend",
      kind: "expense-trend",
      tone: expenseDelta > 0 ? "warning" : "positive",
      value: Math.abs(expenseDelta),
    });
  }

  const top = topCategory(transacoes, current);
  if (top && top.share > 0) {
    insights.push({ id: "top-category", kind: "top-category", tone: "neutral", category: top.category, share: top.share });
  }

  if (currentIncome > 0) {
    const usage = (currentExpenses / currentIncome) * 100;
    insights.push({
      id: "income-usage",
      kind: "income-usage",
      tone: usage >= 90 ? "danger" : usage >= 70 ? "warning" : "positive",
      usage: usage,
    });
  }

  const balanceNow = balanceAt(rendas, transacoes, current);
  const balanceBefore = balanceAt(rendas, transacoes, previous);
  const balanceDelta = percentChange(balanceNow, balanceBefore);
  if (balanceDelta !== null && balanceBefore !== 0 && Math.abs(balanceDelta) >= 1) {
    insights.push({
      id: "balance-trend",
      kind: "balance-trend",
      tone: balanceDelta > 0 ? "positive" : "warning",
      value: Math.abs(balanceDelta),
    });
  }

  const investment = goalsTotalByType(objetivos, GOAL_TYPES.INVESTIMENTO);
  const reserve = goalsTotalByType(objetivos, GOAL_TYPES.RESERVA);
  if (investment > 0 || reserve > 0) {
    insights.push({ id: "allocated", kind: "allocated", tone: "positive", investment: investment, reserve: reserve });
  }

  budgets
    .filter((item) => item.alerta && item.alerta !== "NORMAL")
    .forEach((item) => {
      insights.push({
        id: "budget-" + item.categoria,
        kind: "budget",
        tone: item.alerta === "LIMITE_ATINGIDO" ? "danger" : "warning",
        category: item.categoria,
        usage: Number(item.percentual || 0),
      });
    });

  return insights;
}