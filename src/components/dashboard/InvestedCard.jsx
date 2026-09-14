import { FaBriefcase } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { formatCurrency, formatPercent } from "../../lib/format";
import "../../styles/pages/dashboard.css";

/** Card escuro com dinheiro alocado em investimentos e reserva (metas reais). */
function InvestedCard({ investment, reserve, income }) {
  const { t, i18n } = useTranslation();
  const share = income > 0 ? (investment / income) * 100 : null;

  return (
    <Card tone="hero" padding="lg" className="invested-card">
      <header className="invested-head">
        <span className="card-kicker">{t("dashboard.invested")}</span>
        <span className="invested-icon" aria-hidden="true"><FaBriefcase /></span>
      </header>

      <p className="invested-value">{formatCurrency(investment, i18n.language)}</p>

      <dl className="invested-stats">
        <div>
          <dt>{t("dashboard.ofIncome")}</dt>
          <dd>{share === null ? t("common.noData") : formatPercent(share, i18n.language)}</dd>
        </div>
        <div>
          <dt>{t("dashboard.reserve")}</dt>
          <dd>{formatCurrency(reserve, i18n.language)}</dd>
        </div>
        <div>
          <dt>{t("dashboard.income")}</dt>
          <dd>{formatCurrency(income, i18n.language)}</dd>
        </div>
      </dl>
    </Card>
  );
}

export default InvestedCard;

