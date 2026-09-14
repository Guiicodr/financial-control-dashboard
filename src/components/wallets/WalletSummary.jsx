import { useTranslation } from "react-i18next";
import { formatCurrency, formatPercent } from "../../lib/format";
import "../../styles/pages/wallets.css";

/**
 * Composicao real do patrimonio: saldo disponivel (API), investido e reserva
 * (soma de valorAtual das metas por tipo). Sem integracao bancaria.
 */
function WalletSummary({ composition }) {
  const { t, i18n } = useTranslation();
  const available = Number(composition.available || 0);
  const invested = Number(composition.invested || 0);
  const reserve = Number(composition.reserve || 0);
  const total = available + invested + reserve;

  const items = [
    { id: "available", label: t("wallets.available"), value: available, tone: "accent" },
    { id: "invested", label: t("wallets.invested"), value: invested, tone: "investment" },
    { id: "reserve", label: t("wallets.reserve"), value: reserve, tone: "reserve" },
    { id: "total", label: t("wallets.total"), value: total, tone: "total" },
  ];

  return (
    <section className="wallet-summary">
      {items.map((item) => (
        <article key={item.id} className={"wallet-tile wallet-tile--" + item.tone}>
          <span className="wallet-tile-label">{item.label}</span>
          <strong className="wallet-tile-value">{formatCurrency(item.value, i18n.language)}</strong>
          <em className="wallet-tile-share">
            {item.id === "total"
              ? t("wallets.composition")
              : total > 0
                ? formatPercent((item.value / total) * 100, i18n.language)
                : t("common.noData")}
          </em>
        </article>
      ))}
    </section>
  );
}

export default WalletSummary;

