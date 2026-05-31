import { useEffect, useState } from "react"
import "./App.css"

function App(){

    const [saldo, setSaldo] = useState(0)
    const [transacoes, setTransacoes] = useState([])
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState("")
    const [tipo, setTipo] = useState("ENTRADA")
    const [categoria, setCategoria] = useState("ALIMENTACAO")

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

    return (
        <div className="page">
            <main className="dashboard">
              <header className="header">
                <h1>Controle Financeiro</h1>
                <p>Gerencie suas entradas, saídas e saldo atual.</p>
              </header>

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

                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                      <option value="ALIMENTACAO">ALIMENTACAO</option>
                      <option value="TRANSPORTE">TRANSPORTE</option>
                      <option value="LAZER">LAZER</option>
                      <option value="ESTUDOS">ESTUDOS</option>
                      <option value="SALARIO">SALARIO</option>
                      <option value="OUTROS">OUTROS</option>
                  </select>

                  <button type="submit">Adicionar</button>
                </form>
              </section>

              <section className="transactions-card">
                <h2>Transações</h2>

                <ul>
                  {transacoes.map((t, index) => (
                    <li
                        key={index}
                        className={t.tipo === "ENTRADA" ? "transaction income" : "transaction expense"}
                    >
                      <div>
                        <strong>{t.descricao}</strong>
                        <span>{t.tipo} • {t.categoria}</span>
                      </div>

                      <p>R$ {t.valor}</p>
                      <button
                        className="delete-button"
                        onClick={() => deletarTransacao(t.id)}>
                        Excluir
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            <section className="categories-card">
                          <h2>Consumo</h2>

                          <div className="consumo">
                              <div className="consumo-header">
                                  <span>ALIMENTAÇÃO</span>
                                  <p>R$ {calcularCategoria("ALIMENTACAO")}</p>
                              </div>

                              <div className="bar">
                                  <div
                                      className="bar-fill"
                                      style={{
                                          width: calcularLarguraBarra(
                                              calcularCategoria("ALIMENTACAO")
                                          )
                                      }}
                                  ></div>
                              </div>
                          </div>

                          <div className="consumo">
                              <div className="consumo-header">
                                  <span>LAZER</span>
                                  <p>R$ {calcularCategoria("LAZER")}</p>
                              </div>

                              <div className="bar">
                                  <div
                                      className="bar-fill"
                                      style={{
                                          width: calcularLarguraBarra(
                                              calcularCategoria("LAZER")
                                          )
                                      }}
                                  ></div>
                              </div>
                          </div>

                          <div className="consumo">
                              <div className="consumo-header">
                                  <span>TRANSPORTE</span>
                                  <p>R$ {calcularCategoria("TRANSPORTE")}</p>
                              </div>

                              <div className="bar">
                                  <div
                                      className="bar-fill"
                                      style={{
                                          width: calcularLarguraBarra(
                                              calcularCategoria("TRANSPORTE")
                                          )
                                      }}
                                  ></div>
                              </div>
                          </div>

                          <div className="consumo">
                              <div className="consumo-header">
                                  <span>ESTUDOS</span>
                                  <p>R$ {calcularCategoria("ESTUDOS")}</p>
                              </div>

                              <div className="bar">
                                  <div
                                      className="bar-fill"
                                      style={{
                                          width: calcularLarguraBarra(
                                              calcularCategoria("ESTUDOS")
                                              )
                                          }}
                                      ></div>
                                  </div>
                              </div>


                          <div className="consumo">
                              <div className="consumo-header">
                                  <span>OUTROS</span>
                                  <p>R$ {calcularCategoria("OUTROS")}</p>
                              </div>

                              <div className="bar">
                                  <div
                                      className="bar-fill"
                                      style={{
                                          width: calcularLarguraBarra(
                                              calcularCategoria("OUTROS")
                                          )
                                      }}
                                  ></div>
                              </div>
                          </div>
                </section>

              </main>

          </div>



        )
}
export default App

