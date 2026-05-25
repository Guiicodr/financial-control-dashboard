import { useEffect, useState } from "react"
import "./App.css"

function App(){

    const [saldo, setSaldo] = useState(0)
    const [transacoes, setTransacoes] = useState([])
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState("")
    const [tipo, setTipo] = useState("ENTRADA")

function adicionarTransacoes(event) {
    event.preventDefault()

    const novaTransacao = {
        descricao: descricao,
        valor: Number(valor),
        tipo: tipo,
        data: new Date().toISOString().split("T")[0]
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

    useEffect(() => {
        carregarDados()
    }, [])

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
                        <span>{t.tipo}</span>
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
            </main>
          </div>
        )
}
export default App
