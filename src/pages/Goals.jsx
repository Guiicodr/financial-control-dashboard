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
  calcularProgressoObjetivo
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

              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${calcularProgressoObjetivo(
                      objetivo.valorAtual,
                      objetivo.valorAlvo
                    )}%`
                  }}
                ></div>
              </div>

              <button
                className="delete-button"
                onClick={() => deletarObjetivo(objetivo.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Goals