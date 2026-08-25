import BalanceCard from "../components/ui/BalanceCard";
import FinancialChart from "../components/ui/FinancialChart";
import IncomeExpenseChart from "../components/ui/IncomeExpenseChart";
import MonthComparisonChart from "../components/ui/MonthComparisonChart";
import { useEffect, useState } from "react";
import { listarNotificacoes } from "../services/api";
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
  totalRendas,
  totalSaidas,
  transacoes,
  percentualConsumo,
  diagnosticoFinanceiro,
  categoriasConsumo,
  calcularCategoria,
  objetivos,
  calcularProgressoObjetivo,
  abrirObjetivos
}) {
  const [notificacoes, setNotificacoes] = useState([]);
  useEffect(() => { listarNotificacoes().then(setNotificacoes).catch(() => setNotificacoes([])); }, []);

  return (
    <>

      <section className="dashboard-hero">

        <div>

          <h1>

            Good afternoon, Guilherme

          </h1>

          <p>

            Here's your financial overview today.

          </p>

        </div>

      </section>

      <BalanceCard saldo={saldo} />

      <section className="overview-grid">
        <StatCard title="Income" value={totalRendas} prefix="R$ " icon={<FaArrowTrendUp />} variant="success" subtitle="Recurring income" />
        <StatCard title="Expenses" value={totalSaidas} prefix="R$ " icon={<FaArrowTrendDown />} variant="danger" subtitle="Monthly expenses" />
        <StatCard title="Balance" value={saldo} prefix="R$ " icon={<FaWallet />} variant="primary" subtitle="Available balance" />
        <StatCard title="Income Usage" value={percentualConsumo.toFixed(1)} suffix="%" icon={<FaChartPie />} variant="warning" subtitle="Current month" />
      </section>

      <FinancialChart />

      <IncomeExpenseChart totalRendas={totalRendas} totalSaidas={totalSaidas} />
      <MonthComparisonChart transacoes={transacoes} />
      {notificacoes.length > 0 && <section className="insight-card warning"><h2>Alerts</h2>{notificacoes.map((item, index) => <p key={`${item.tipo}-${index}`}><strong>{item.titulo}:</strong> {item.mensagem}</p>)}</section>}

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
              totalRendas === 0
                ? 0
                : (valor / totalRendas) * 100
            let cor = "#22C55E";

            if (percentual >= 30) {
              cor = "#EF4444";
            } else if (percentual >= 15) {
              cor = "#F59E0B";
            }

            return (
              <div
                key={categoria.value}
                className="category-item"
              >
                <div className="category-header">

                  <span>{categoria.label}</span>

                  <div className="category-values">

                    <strong>
                      R$ {valor.toFixed(2)}
                    </strong>

                    <small>
                      {percentual.toFixed(1)}%
                    </small>

                  </div>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(percentual, 100)}%`,
                      backgroundColor: cor
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