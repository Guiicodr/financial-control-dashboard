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
      <section className="overview-grid">
        <div className="overview-card income-overview">
          <span>Income</span>
          <strong>R$ {totalEntradas}</strong>
        </div>

        <div className="overview-card expense-overview">
          <span>Expenses</span>
          <strong>R$ {totalSaidas}</strong>
        </div>

        <div className="overview-card balance-overview">
          <span>Balance</span>
          <strong>R$ {saldo}</strong>
        </div>

        <div className="overview-card percent-overview">
          <span>Income Usage</span>
          <strong>{percentualConsumo.toFixed(1)}%</strong>
        </div>
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