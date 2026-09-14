import { useTranslation } from "react-i18next";
import { FaCreditCard, FaTrash } from "react-icons/fa6";
import { formatCurrency } from "../../lib/format";
import "../../styles/pages/wallets.css";

function CreditCardTile({ cartao, onDelete }) {
  const { t, i18n } = useTranslation();
  const fechamento = cartao.diaFechamento || "-";
  const vencimento = cartao.diaVencimento || "-";

  return (
    <article className="cc-tile">
      <header className="cc-head">
        <span className="cc-chip" aria-hidden="true"><FaCreditCard /></span>
        <button
          type="button"
          className="cc-delete"
          onClick={() => onDelete(cartao)}
          aria-label={t("wallets.deleteTitle")}
        >
          <FaTrash />
        </button>
      </header>
      <p className="cc-name">{cartao.nome}</p>
      <p className="cc-limit">{formatCurrency(cartao.limite, i18n.language)}</p>
      <footer className="cc-foot">
        <span>{t("wallets.closingDay")}: {fechamento}</span>
        <span>{t("wallets.dueDay")}: {vencimento}</span>
      </footer>
    </article>
  );
}

export default CreditCardTile;

