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

function calcularCategoria(nomeCategoria) {
    return transacoes
    .filter((t) => t.tipo === "SAIDA")
    .filter((t) => t.categoria === nomeCategoria)
    .reduce((total, t) => total + Number(t.valor), 0)
    }

const totalEntradas = transacoes
    .filter((t) => t.tipo === "ENTRADA")
    .reduce((total, t) => total + Number(t.valor), 0)

const totalSaidas = transacoes
    .filter((t) => t.tipo === "SAIDA")
    .reduce((total, t) => total + Number(t.valor), 0)

const percentualConsumo = totalEntradas === 0
    ? 0
    :(totalSaidas / totalEntradas) * 100

function gerarDiagnosticoFinanceiro() {
  if (totalEntradas === 0) {
    return {
      titulo: "Sem dados suficientes",
      mensagem: "Cadastre uma entrada para visualizar seu diagnóstico financeiro.",
      status: "neutral"
    }
  }

  if (percentualConsumo <= 50) {
    return {
      titulo: "Situação saudável",
      mensagem: "Você está consumindo menos da metade da sua renda.",
      status: "healthy"
    }
  }

  if (percentualConsumo <= 80) {
    return {
      titulo: "Atenção aos gastos",
      mensagem: "Seus gastos já representam uma parte considerável da sua renda.",
      status: "warning"
    }
  }

  return {
    titulo: "Alerta financeiro",
    mensagem: "Seus gastos estão muito próximos da sua renda total.",
    status: "danger"
  }
}

const diagnosticoFinanceiro = gerarDiagnosticoFinanceiro()

const cores = ["#22c55e", "ef4444"]

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
            <span className="eyebrow">Assistente Financeiro</span>
            <h1>Financial Dashboard</h1>
            <p>Acompanhe sua renda, seus gastos e sua evolução financeira.</p>
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

