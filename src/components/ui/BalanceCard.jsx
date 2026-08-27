import "../../styles/components/BalanceCard.css";
import { FaWallet } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function BalanceCard({ saldo }) {
    const { t, i18n } = useTranslation();

    return (

        <section className="balance-card">

            <div className="balance-info">

                <span className="balance-title">
                    {t("balanceCard.title")}
                </span>

                <h1>
                    {new Intl.NumberFormat(i18n.language, { style: "currency", currency: "BRL" }).format(Number(saldo))}
                </h1>

                <div className="balance-footer">

                    <span className="growth">
                        ▲ +0%
                    </span>

                    <span>
                        {t("balanceCard.updated")}
                    </span>

                </div>

            </div>

            <div className="balance-icon">

                <FaWallet />

            </div>

        </section>

    )

}

export default BalanceCard;
