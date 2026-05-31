function Dashboard({
  saldo,
  totalEntradas,
  totalSaidas,
  percentualConsumo,
  diagnosticoFinanceiro,
  categoriasConsumo,
  calcularCategoria
}) {
  return (
    <>
      <section className="overview-grid">
        <div className="overview-card income-overview">
          <span>Renda total</span>
          <strong>R$ {totalEntradas}</strong>
        </div>

        <div className="overview-card expense-overview">
          <span>Gastos totais</span>
          <strong>R$ {totalSaidas}</strong>
        </div>

        <div className="overview-card balance-overview">
          <span>Saldo mensal</span>
          <strong>R$ {saldo}</strong>
        </div>

        <div className="overview-card percent-overview">
          <span>Consumo da renda</span>
          <strong>{percentualConsumo.toFixed(1)}%</strong>
        </div>
      </section>

      <section className={`insight-card ${diagnosticoFinanceiro.status}`}>
        <h2>{diagnosticoFinanceiro.titulo}</h2>
        <p>{diagnosticoFinanceiro.mensagem}</p>
      </section>

      <section className="chart-card">
        <h2>Resumo financeiro</h2>

        <div className="summary-row">
          <div className="summary-box income-box">
            <span>Entradas</span>
            <strong>R$ {totalEntradas}</strong>
          </div>

          <div className="summary-box expense-box">
            <span>Saídas</span>
            <strong>R$ {totalSaidas}</strong>
          </div>
        </div>
      </section>

      <section className="categories-card">
        <h2>Consumo</h2>

        {categoriasConsumo.map((categoriaItem) => (
          <div className="consumo" key={categoriaItem.value}>
            <div className="consumo-header">
              <span>{categoriaItem.label}</span>
              <p>R$ {calcularCategoria(categoriaItem.value)}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

export default Dashboard