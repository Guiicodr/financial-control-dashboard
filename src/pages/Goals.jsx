import "../styles/pages/Goals.css";

function Goals({
  objetivos,
  nomeObjetivo,
  setNomeObjetivo,
  valorAlvo,
  setValorAlvo,
  valorAtual,
  setValorAtual,
  prazo,
  setPrazo,
  tipoObjetivo,
  setTipoObjetivo,
  adicionarObjetivo,
  deletarObjetivo,
  calcularProgressoObjetivo,
  registrarMovimentoMeta
}) {
  return (
    <>
      <section className="form-card">
        <h2>Novo objetivo</h2>

        <form onSubmit={adicionarObjetivo}>
          <input
            type="text"
            placeholder="Nome do objetivo"
            value={nomeObjetivo}
            onChange={(e) => setNomeObjetivo(e.target.value)}
          />

          <input
            type="number"
            placeholder="Valor alvo"
            value={valorAlvo}
            onChange={(e) => setValorAlvo(e.target.value)}
          />

          <input
            type="number"
            placeholder="Valor atual"
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
          />

          <input
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />

          <select
            value={tipoObjetivo}
            onChange={(e) => setTipoObjetivo(e.target.value)}
          >
            <option value="COMPRA">Compra</option>
            <option value="ECONOMIA">Economia</option>
            <option value="INVESTIMENTO">Investimento</option>
            <option value="RESERVA">Reserva</option>
          </select>

          <button type="submit">Adicionar objetivo</button>
        </form>
      </section>

      <section className="transactions-card">
        <h2>Objetivos</h2>

        <ul>
          {objetivos.map((objetivo) => (
            <li key={objetivo.id}>
              <div>
                <strong>{objetivo.nome}</strong>
                <span>
                  {objetivo.tipo} • Prazo: {objetivo.prazo}
                </span>
              </div>

              <p>
                R$ {objetivo.valorAtual} / R$ {objetivo.valorAlvo}
              </p>

              <span>
                {calcularProgressoObjetivo(
                  objetivo.valorAtual,
                  objetivo.valorAlvo
                ).toFixed(1)}% concluído
              </span>

              <small className="goal-simulation">
                {objetivo.prazo && new Date(objetivo.prazo) > new Date()
                  ? `Guardar R$ ${((Math.max(0, Number(objetivo.valorAlvo) - Number(objetivo.valorAtual))) / Math.max(1, Math.ceil((new Date(objetivo.prazo) - new Date()) / (1000 * 60 * 60 * 24 * 30)))).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês até ${new Date(objetivo.prazo).toLocaleDateString("pt-BR")}`
                  : "Prazo vencido ou não definido"}
              </small>

              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min(calcularProgressoObjetivo(
                      objetivo.valorAtual,
                      objetivo.valorAlvo
                    ), 100)}%`
                  }}
                ></div>
              </div>

              <button
                className="delete-button"
                onClick={() => deletarObjetivo(objetivo.id)}
              >
                Excluir
              </button>
              <div className="goal-movement-actions">
                <button type="button" onClick={() => registrarMovimentoMeta(objetivo.id, { valor: 100, tipo: "APORTE" })}>+ R$ 100</button>
                <button type="button" onClick={() => registrarMovimentoMeta(objetivo.id, { valor: 100, tipo: "RESGATE" })}>- R$ 100</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Goals