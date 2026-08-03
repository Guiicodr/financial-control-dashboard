import {
  FaTrash,
  FaBurger,
  FaCar,
  FaGamepad,
  FaBook,
  FaBox,
} from "react-icons/fa6";

import "../styles/pages/Transactions.css";

const categoryIcons = {
  ALIMENTACAO: <FaBurger />,
  TRANSPORTE: <FaCar />,
  LAZER: <FaGamepad />,
  ESTUDOS: <FaBook />,
  OUTROS: <FaBox />,
};

const categoryLabels = {
  ALIMENTACAO: "Food",
  TRANSPORTE: "Transport",
  LAZER: "Leisure",
  ESTUDOS: "Education",
  OUTROS: "Others",
};

function Transactions({
  descricao,
  setDescricao,
  valor,
  setValor,
  categoria,
  setCategoria,
  categoriasFormulario,
  transacoes,
  adicionarTransacoes,
  deletarTransacao,
}) {
  return (
    <div className="transactions-page">

      <div className="page-header">
        <h1>Transactions</h1>
        <p>Manage your expenses.</p>
      </div>

      <div className="transactions-form-card">

        <form
          className="transactions-form"
          onSubmit={adicionarTransacoes}
        >

          <input
            type="text"
            placeholder="Description"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasFormulario
              .filter((cat) => cat.value !== "SALARIO")
              .map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                >
                  {cat.label}
                </option>
              ))}
          </select>

          <button
            className="add-btn"
            type="submit"
          >
            Add Transaction
          </button>

        </form>

      </div>

      <div className="transactions-toolbar">

        <input
          className="transactions-search"
          placeholder="🔍 Search transaction..."
        />

        <select className="transactions-filter">
          <option>All Categories</option>

          {categoriasFormulario
            .filter(cat => cat.value !== "SALARIO")
            .map(cat => (
              <option key={cat.value}>
                {cat.label}
              </option>
            ))}
        </select>

      </div>

      <div className="transactions-list">

        {transacoes.length === 0 ? (

          <div className="transactions-empty">
            No transactions registered.
          </div>

        ) : (

          transacoes
            .filter((t) => t.tipo === "SAIDA")
            .map((t) => (

              <div
                className="transaction-card"
                key={t.id}
              >

                <div className="transaction-left">

                  <div className="transaction-icon expense">
                    {categoryIcons[t.categoria]}
                  </div>

                  <div className="transaction-info">

                    <h3>{t.descricao}</h3>

                    <p>
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>

                    <span>
                      {categoryIcons[t.categoria]}{" "}
                      {categoryLabels[t.categoria]}
                    </span>

                  </div>

                </div>

                <div className="transaction-right">

                  <strong className="transaction-value">
                    - R${" "}
                    {Number(t.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>

                  <button
                    onClick={() => deletarTransacao(t.id)}
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            ))

        )}

      </div>

    </div>
  );
}

export default Transactions;