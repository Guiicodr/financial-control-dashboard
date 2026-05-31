function Transactions({
  descricao,
  setDescricao,
  valor,
  setValor,
  tipo,
  setTipo,
  categoria,
  setCategoria,
  categoriasFormulario,
  transacoes,
  adicionarTransacoes,
  deletarTransacao
}) {
  return (
    <>
      <section className="form-card">
        <h2>Nova transação</h2>

        <form onSubmit={adicionarTransacoes}>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasFormulario.map((categoriaItem) => (
              <option key={categoriaItem.value} value={categoriaItem.value}>
                {categoriaItem.label}
              </option>
            ))}
          </select>

          <button type="submit">Adicionar</button>
        </form>
      </section>

      <section className="transactions-card">
        <h2>Transações</h2>

        <ul>
          {transacoes.map((t) => (
            <li
              key={t.id}
              className={
                t.tipo === "ENTRADA"
                  ? "transaction income"
                  : "transaction expense"
              }
            >
              <div>
                <strong>{t.descricao}</strong>
                <span>
                  {t.tipo} • {t.categoria}
                </span>
              </div>

              <p>R$ {t.valor}</p>

              <button
                className="delete-button"
                onClick={() => deletarTransacao(t.id)}
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

export default Transactions