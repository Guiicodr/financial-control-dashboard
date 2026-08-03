import { FaBriefcase, FaTrash } from "react-icons/fa6";
import "../styles/pages/Income.css";

function Income({
  rendas,
  descricaoRenda,
  setDescricaoRenda,
  valorRenda,
  setValorRenda,
  carregarRendas,
  criarRenda,
  deletarRendaPorId
}) {

  function adicionarRenda(event) {
    event.preventDefault();

    const novaRenda = {
      descricao: descricaoRenda,
      valor: Number(valorRenda)
    };

    criarRenda(novaRenda).then(() => {
      carregarRendas();

      setDescricaoRenda("");
      setValorRenda("");
    });
  }

  function deletar(id) {
    deletarRendaPorId(id)
      .then(() => carregarRendas());
  }

  return (

    <div className="income-page">

      <div className="page-header">

        <h1>Income</h1>

        <p>
          Manage your recurring income sources.
        </p>

      </div>

      <div className="income-form-card">

        <form
          className="income-form"
          onSubmit={adicionarRenda}
        >

          <input
            type="text"
            placeholder="Description"
            value={descricaoRenda}
            onChange={(e) =>
              setDescricaoRenda(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={valorRenda}
            onChange={(e) =>
              setValorRenda(e.target.value)
            }
          />

          <button type="submit">

            + Add Income

          </button>

        </form>

      </div>

      <div className="income-list">

        {rendas.length === 0 ? (

          <div className="income-empty">

            <FaBriefcase />

            <h3>No income registered</h3>

            <p>
              Register your first recurring income.
            </p>

          </div>

        ) : (

          rendas.map((renda) => (

            <div
              className="income-item"
              key={renda.id}
            >

              <div className="income-left">

                <div className="income-icon">

                  <FaBriefcase />

                </div>

                <div>

                  <h3>

                    {renda.descricao}

                  </h3>

                  <span>

                    Recurring income

                  </span>

                </div>

              </div>

              <div className="income-right">

                <strong>

                  R$ {Number(renda.valor).toLocaleString("pt-BR")}

                </strong>

                <button
                  onClick={() => deletar(renda.id)}
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

export default Income;