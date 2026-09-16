/**
 * Finanly - utilitarios de formatacao centralizados.
 * Nenhum componente deve montar Intl.NumberFormat manualmente.
 */

const DEFAULT_LOCALE = "pt-BR";
const CURRENCY = "BRL";

export function formatCurrency(value, locale = DEFAULT_LOCALE) {
  const number = Number(value);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
  }).format(Number.isFinite(number) ? number : 0);
}

/** R$ 24,9 mil - versao compacta para eixos e legendas */
export function formatCompactCurrency(value, locale = DEFAULT_LOCALE) {
  const number = Number(value);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(number) ? number : 0);
}

/** 1.250,00 (sem simbolo de moeda) */
export function formatNumber(value, locale = DEFAULT_LOCALE, digits = 2) {
  const number = Number(value);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(number) ? number : 0);
}

/** 12,4% */
export function formatPercent(value, locale = DEFAULT_LOCALE, digits = 1) {
  const number = Number(value);
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(number) ? number : 0);
  return formatted + "%";
}

/** +12,4% / -3,2% */
export function formatSignedPercent(value, locale = DEFAULT_LOCALE, digits = 1) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : number < 0 ? "-" : "";
  return sign + formatPercent(Math.abs(number), locale, digits);
}

/** + R$ 1.250,00 / - R$ 612,34 */
export function formatSignedCurrency(value, locale = DEFAULT_LOCALE) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : number < 0 ? "-" : "";
  return sign + " " + formatCurrency(Math.abs(number), locale);
}

/** 02 Abr */
export function formatDayMonth(value, locale = DEFAULT_LOCALE) {
  const date = parseISODate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" })
    .format(date)
    .replace(".", "");
}

/** 02/04/2026 */
export function formatDate(value, locale = DEFAULT_LOCALE) {
  const date = parseISODate(value);
  if (!date) return "-";
  return date.toLocaleDateString(locale);
}

/** Abril de 2026 */
export function formatMonthYear(monthKey, locale = DEFAULT_LOCALE) {
  const date = parseMonthKey(monthKey);
  if (!date) return "-";
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** ABR */
export function formatMonthShort(monthKey, locale = DEFAULT_LOCALE) {
  const date = parseMonthKey(monthKey);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

/** Set 2026 - mes abreviado com ano, para rotulos compactos de periodo. */
export function formatMonthShortYear(monthKey, locale = DEFAULT_LOCALE) {
  const date = parseMonthKey(monthKey);
  if (!date) return "-";
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(date).replace(".", "");
  return month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getFullYear();
}

/** Converte qualquer data (ISO, Date, epoch) em Date local segura. */
export function parseISODate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const fromEpoch = new Date(value);
    return Number.isNaN(fromEpoch.getTime()) ? null : fromEpoch;
  }
  if (!value) return null;
  const text = String(value);
  const isoDay = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (isoDay) return new Date(Number(isoDay[1]), Number(isoDay[2]) - 1, Number(isoDay[3]));
  const isoMonth = /^(\d{4})-(\d{2})$/.exec(text);
  if (isoMonth) return new Date(Number(isoMonth[1]), Number(isoMonth[2]) - 1, 1);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** "2026-04" -> Date(2026, 3, 1) */
export function parseMonthKey(monthKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(monthKey || ""));
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

/** Date -> "2026-04" */
export function monthKeyOf(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return year + "-" + month;
}

export function currentMonthKey() {
  return monthKeyOf(new Date());
}

/** "2026-04" + (-2) -> "2026-02" */
export function shiftMonth(monthKey, delta) {
  const date = parseMonthKey(monthKey) || new Date();
  return monthKeyOf(new Date(date.getFullYear(), date.getMonth() + delta, 1));
}

/** Lista de monthKeys terminando em endMonth (inclusive). */
export function monthRange(months, endMonth = currentMonthKey()) {
  const total = Math.max(1, Number(months) || 1);
  const keys = [];
  for (let index = total - 1; index >= 0; index -= 1) keys.push(shiftMonth(endMonth, -index));
  return keys;
}

/** Diferenca em meses entre dois monthKeys. */
export function monthsBetween(fromMonthKey, toMonthKey) {
  const from = parseMonthKey(fromMonthKey);
  const to = parseMonthKey(toMonthKey);
  if (!from || !to) return 0;
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/** Guilherme Costa -> GC */
export function initialsOf(name, fallback = "?") {
  if (!name) return fallback;
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}