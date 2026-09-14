import { useTranslation } from "react-i18next";
import { FaBurger, FaCar, FaGamepad, FaBook, FaBox, FaReceipt, FaPenToSquare, FaTrash } from "react-icons/fa6";
import EmptyState from "../ui/EmptyState";
import CategoryBadge from "../ui/CategoryBadge";
import { formatDayMonth, formatSignedCurrency } from "../../lib/format";
import "../../styles/pages/transactions.css";

const ICONS = {
  ALIMENTACAO: <FaBurger />,
  TRANSPORTE: <FaCar />,
  LAZER: <FaGamepad />,
  ESTUDOS: <FaBook />,
  OUTROS: <FaBox />,
};

function TransactionList({ items, onEdit, onDelete, emptyTitle, emptyText, emptyAction }) {
  const { t, i18n } = useTranslation();

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyText} action={emptyAction} />;
  }

  return (
    <ul className="tx-list">
      {items.map((item) => {
        const receita = item.origem === "RECEITA";
        const valor = Number(item.valor || 0);
        return (
          <li key={item.chave} className="tx-item">
            <span className={"tx-icon tx-icon--" + (receita ? "income" : "expense")} aria-hidden="true">
              {receita ? <FaReceipt /> : ICONS[item.categoria] || <FaBox />}
            </span>

            <span className="tx-info">
              <strong>{item.descricao}</strong>
              <span className="tx-meta">
                {receita ? <span className="category-badge">{t("tx.typeRECEITA")}</span> : <CategoryBadge category={item.categoria} />}
                <em>{formatDayMonth(item.data, i18n.language)}</em>
              </span>
            </span>

            <span className={"tx-value tx-value--" + (receita ? "income" : "expense")}>
              {formatSignedCurrency(receita ? valor : -valor, i18n.language)}
            </span>

            <span className="tx-actions">
              {receita ? null : (
                <button type="button" className="tx-action" onClick={() => onEdit(item)} aria-label={t("tx.edit")}>
                  <FaPenToSquare />
                </button>
              )}
              <button
                type="button"
                className="tx-action tx-action--danger"
                onClick={() => onDelete(item)}
                aria-label={t("transactions.delete")}
              >
                <FaTrash />
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default TransactionList;

