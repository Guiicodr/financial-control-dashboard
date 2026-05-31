import { useEffect, useState } from "react"
import "./App.css"

function App(){

    const [saldo, setSaldo] = useState(0)
    const [transacoes, setTransacoes] = useState([])
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState("")
    const [tipo, setTipo] = useState("ENTRADA")
    const [categoria, setCategoria] = useState("ALIMENTACAO")
    const [telaAtual, setTelaAtual] = useState("dashboard")

function adicionarTransacoes(event) {
    event.preventDefault()

    const novaTransacao = {
        descricao: descricao,
        valor: Number(valor),
        tipo: tipo,
        data: new Date().toISOString().split("T")[0],
        categoria: categoria
        }
    fetch("http://localhost:8080/transacoes",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaTransacao)
        })
        .then(() => {
            carregarDados()

            setDescricao("")
            setValor("")
            setTipo("ENTRADA")

        })
    }
function carregarDados(){
    fetch("http://localhost:8080/transacoes/saldo")
        .then(response => response.json())
        .then(data => setSaldo(data))

    fetch("http://localhost:8080/transacoes")
        .then(response => response.json())
        .then(data => setTransacoes(data))
        }
function deletarTransacao(id) {
   fetch(`http://localhost:8080/transacoes/${id}`, {
     method: "DELETE"
   })
     .then(() => carregarDados())
 }
function calcularLarguraBarra(valor) {
    if (totalEntradas == 0){
        return "0%"
        }
    return `${(valor / totalEntradas) * 100}%`
}

    useEffect(() => {
        carregarDados()
    }, [])

const totalEntradas = transacoes
    .filter((t) => t.tipo === "ENTRADA")
    .reduce((total, t) => total + Number(t.valor), 0)

const totalSaidas = transacoes
    .filter((t) => t.tipo === "SAIDA")
    .reduce((total, t) => total + Number(t.valor), 0)

function calcularCategoria(nomeCategoria) {
    return transacoes
    .filter((t) => t.tipo === "SAIDA")
    .filter((t) => t.categoria === nomeCategoria)
    .reduce((total, t) => total + Number(t.valor), 0)
    }


const dadosGrafico = [
    { name: "Entradas", value: totalEntradas },
    { name: "Saídas", value: totalSaidas }
]

const cores = ["#22c55e", "ef4444"]

console.log(dadosGrafico)

const maiorGastoCategoria = Math.max(
    calcularCategoria("ALIMENTACAO"),
    calcularCategoria("LAZER"),
    calcularCategoria("TRANSPORTE"),
    calcularCategoria("ESTUDOS"),
    calcularCategoria("OUTROS")
)

const categoriasConsumo = [
  { label: "ALIMENTAÇÃO", value: "ALIMENTACAO" },
  { label: "LAZER", value: "LAZER" },
  { label: "TRANSPORTE", value: "TRANSPORTE" },
  { label: "ESTUDOS", value: "ESTUDOS" },
  { label: "OUTROS", value: "OUTROS" }
]

const categoriasFormulario = [
  { label: "Alimentação", value: "ALIMENTACAO" },
  { label: "Transporte", value: "TRANSPORTE" },
  { label: "Lazer", value: "LAZER" },
  { label: "Estudos", value: "ESTUDOS" },
  { label: "Salário", value: "SALARIO" },
  { label: "Outros", value: "OUTROS" }
]

    return (
      <div className="page">
        <main className="dashboard">
          <header className="header">
            <h1>Controle Financeiro</h1>
            <p>Gerencie suas entradas, saídas e saldo atual.</p>
          </header>

          <nav className="nav-tabs">
            <button onClick={() => setTelaAtual("dashboard")}>
              Dashboard
            </button>

            <button onClick={() => setTelaAtual("transacoes")}>
              Transações
            </button>
          </nav>

          {telaAtual === "dashboard" && (
            <>
              <section className="balance-card">
                <span>Saldo atual</span>
                <strong>R$ {saldo}</strong>
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

                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: calcularLarguraBarra(
                            calcularCategoria(categoriaItem.value)
                          )
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}

          {telaAtual === "transacoes" && (
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
          )}
        </main>
      </div>
    )
}
export default App

