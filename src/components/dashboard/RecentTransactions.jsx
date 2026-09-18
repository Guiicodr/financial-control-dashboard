import { useMemo } from "react";
import { FaBurger, FaCar, FaGamepad, FaBook, FaBox, FaReceipt } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import CategoryBadge from "../ui/CategoryBadge";
import { formatDayMonth, formatSignedCurrency } from "../../lib/format";
const CATEGORY_ICONS = {
  ALIMENTACAO: <FaBurger />,
  TRANSPORTE: <FaCar />,
  LAZER: <FaGamepad />,
  ESTUDOS: <FaBook />,
  SALARIO: <FaReceipt />,
  OUTROS: <FaBox />,
};

function RecentTransactions({ transacoes, limit = 5, onSeeAll }) {
  const { t, i18n } = useTranslation();
  const list = useMemo(
    () =>
      (transacoes || [])
        .slice()
        .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")))
        .slice(0, limit),
    [transacoes, limit],
  );

  return (
    <Card className="recent-card">
      <div className="card-head">
        <div>
          <span className="card-kicker">{t("dashboard.recent")}</span>
          <p className="card-subtitle">{t("dashboard.recentHint", { count: list.length })}</p>
        </div>
        {onSeeAll ? (
          <button type="button" className="btn btn--link" onClick={onSeeAll}>
            {t("common.viewAll")}
          </button>
        ) : null}
      </div>

      {list.length === 0 ? (
        <EmptyState title={t("dashboard.noTransactions")} description={t("dashboard.noTransactionsHint")} />
      ) : (
        <ul className="recent-list">
          {list.map((item) => {
            const value = Number(item.valor || 0);
            return (
              <li key={item.id}>
                <span className="recent-icon" aria-hidden="true">{CATEGORY_ICONS[item.categoria] || <FaBox />}</span>
                <span className="recent-info">
                  <strong>{item.descricao}</strong>
                  <span className="recent-meta">
                    <CategoryBadge category={item.categoria} />
                    <em>{formatDayMonth(item.data, i18n.language)}</em>
                  </span>
                </span>
                <span className="recent-value recent-value--expense">{formatSignedCurrency(-value, i18n.language)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default RecentTransactions;

