import BalanceCard from "../components/ui/BalanceCard";
import FinancialChart from "../components/ui/FinancialChart";
import StatCard from "../components/ui/StatCard";
import {
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaWallet,
    FaChartPie
} from "react-icons/fa6"
import "../styles/pages/Dashboard.css";

function Dashboard({
  saldo,
  totalEntradas,
  totalSaidas,
  percentualConsumo,
  diagnosticoFinanceiro,
  categoriasConsumo,
  calcularCategoria,
  objetivos,
  calcularProgressoObjetivo,
  abrirObjetivos
}) {

  const categoryIcons = {
    ALIMENTACAO: "🍔",
    LAZER: "🎮",
    TRANSPORTE: "🚗",
    ESTUDOS: "📚",
    OUTROS: "📦"
  }

  const valoresCategorias = categoriasConsumo.map((categoria) =>
    calcularCategoria(categoria.value)
  )

  const maiorValorCategoria = Math.max(
    ...valoresCategorias,
    1
  )

  return (
    <>

      <section className="dashboard-hero">

          <div>

              <h1>

                  Good afternoon, Guilherme 👋

              </h1>

              <p>

                  Here's your financial overview today.

              </p>

          </div>

      </section>

      <BalanceCard saldo={saldo} />

      <FinancialChart />

      <section className="overview-grid">
        <StatCard
            title="Income"
            value={totalEntradas}
            prefix="R$ "
            icon={<FaArrowTrendUp />}
            variant="success"
            subtitle="Recurring income"
        />

        <StatCard
            title="Expenses"
            value={totalSaidas}
            prefix="R$ "
            icon={<FaArrowTrendDown />}
            variant="danger"
            subtitle="Monthly expenses"
        />

        <StatCard
            title="Balance"
            value={saldo}
            prefix="R$ "
            icon={<FaWallet />}
            variant="primary"
            subtitle="Available balance"
        />

        <StatCard
            title="Income Usage"
            value={percentualConsumo.toFixed(1)}
            suffix="%"
            icon={<FaChartPie />}
            variant="warning"
            subtitle="Current month"
        />

      </section>

      <section
        className={`insight-card ${diagnosticoFinanceiro.status}`}
      >
        <h2>{diagnosticoFinanceiro.titulo}</h2>
        <p>{diagnosticoFinanceiro.mensagem}</p>
      </section>

      <div className="dashboard-grid">

        <section className="categories-card">
          <h2>Consumption</h2>

          {categoriasConsumo.map((categoria) => {
            const valor = calcularCategoria(
              categoria.value
            )

            const percentual =
              (valor / maiorValorCategoria) * 100

            return (
              <div
                key={categoria.value}
                className="category-item"
              >
                <div className="category-header">

                  <span>
                    {categoryIcons[categoria.value]}{" "}
                    {categoria.label}
                  </span>

                  <strong>
                    R$ {valor}
                  </strong>

                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentual}%`
                    }}
                  />
                </div>

              </div>
            )
          })}
        </section>

        <section className="goals-card">

          <div className="goals-header">
            <h2>🎯 Goals</h2>

            {objetivos.length > 0 && (
              <span className="notification-dot"></span>
            )}
          </div>

          {objetivos.length === 0 ? (
            <div className="empty-goals">
              <p>No goals registered yet.</p>

              <button
                className="goal-action-btn"
                onClick={abrirObjetivos}
              >
                + New Goal
              </button>
            </div>
          ) : (
            objetivos
              .slice(0, 3)
              .map((objetivo) => {

                const progresso =
                  calcularProgressoObjetivo(
                    objetivo.valorAtual,
                    objetivo.valorAlvo
                  )

                return (
                  <div
                    key={objetivo.id}
                    className="goal-preview"
                  >

                    <strong>
                      {objetivo.nome}
                    </strong>

                    <span className="goal-values">
                      R$ {objetivo.valorAtual} / R$ {objetivo.valorAlvo}
                    </span>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progresso}%`
                        }}
                      />
                    </div>

                    <span>
                      {progresso.toFixed(0)}%
                    </span>

                  </div>
                )
              })
          )}

        </section>

      </div>
    </>
  )
}

export default Dashboard