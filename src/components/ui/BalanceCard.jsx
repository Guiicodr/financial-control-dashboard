import "../../styles/components/BalanceCard.css";
import { FaWallet } from "react-icons/fa";

function BalanceCard({ saldo }) {

    return (

        <section className="balance-card">

            <div className="balance-info">

                <span className="balance-title">
                    Available Balance
                </span>

                <h1>
                    R$ {saldo}
                </h1>

                <div className="balance-footer">

                    <span className="growth">
                        ▲ +0%
                    </span>

                    <span>
                        Updated in real time
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