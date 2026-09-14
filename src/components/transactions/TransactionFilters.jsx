import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { EXPENSE_CATEGORIES } from "../../lib/finance";
import { formatMonthYear } from "../../lib/format";
import "../../styles/pages/transactions.css";

const SORTS = ["dateDesc", "dateAsc", "valueDesc", "valueAsc"];

function TransactionFilters({ filters, onChange, months, onClear, disabled }) {
  const { t, i18n } = useTranslation();
  const set = (field) => (event) => onChange(field, event.target.value);

  return (
    <div className="tx-filters">
      <label className="tx-search">
        <FaMagnifyingGlass aria-hidden="true" />
        <input
          value={filters.busca}
          onChange={set("busca")}
          placeholder={t("transactions.search")}
          aria-label={t("transactions.search")}
        />
      </label>

      <select value={filters.tipo} onChange={set("tipo")} aria-label={t("tx.type")}>
        <option value="TODAS">{t("tx.allTypes")}</option>
        <option value="DESPESA">{t("tx.typeDESPESA")}</option>
        <option value="RECEITA">{t("tx.typeRECEITA")}</option>
      </select>

      <select value={filters.categoria} onChange={set("categoria")} aria-label={t("tx.category")}>
        <option value="TODAS">{t("transactions.allCategories")}</option>
        {EXPENSE_CATEGORIES.map((category) => (
          <option key={category} value={category}>{t("categories." + category)}</option>
        ))}
      </select>

      <select value={filters.mes} onChange={set("mes")} aria-label={t("transactions.filterMonth")}>
        <option value="TODOS">{t("tx.allMonths")}</option>
        {months.map((month) => (
          <option key={month} value={month}>{formatMonthYear(month, i18n.language)}</option>
        ))}
      </select>

      <select value={filters.ordem} onChange={set("ordem")} aria-label={t("tx.sort")}>
        {SORTS.map((sort) => (
          <option key={sort} value={sort}>{t("tx.sort" + sort)}</option>
        ))}
      </select>

      <button type="button" className="btn btn--ghost btn--sm" onClick={onClear} disabled={disabled}>
        {t("tx.clear")}
      </button>
    </div>
  );
}

export default TransactionFilters;

