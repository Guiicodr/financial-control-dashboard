import { useEffect, useState } from "react"
import "./App.css"
import Dashboard from "./components/Dashboard"
import Transactions from "./components/Transactions"
import Goals from "./components/Goals"

function App(){

    const [saldo, setSaldo] = useState(0)
    const [transacoes, setTransacoes] = useState([])
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState("")
    const [tipo, setTipo] = useState("ENTRADA")
    const [categoria, setCategoria] = useState("ALIMENTACAO")
    const [telaAtual, setTelaAtual] = useState("dashboard")
    const [objetivos, setObjetivos] = useState([])
    const [nomeObjetivo, setNomeObjetivo] = useState("")
    const [valorAlvo, setValorAlvo] = useState("")
    const [valorAtual, setValorAtual] = useState("")
    const [prazo, setPrazo] = useState("")
    const [tipoObjetivo, setTipoObjetivo] = useState("COMPRA")

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

function calcularProgressoObjetivo(valorAtual, valorAlvo) {
  if (valorAlvo === 0) {
    return 0
  }

  return (valorAtual / valorAlvo) * 100
}

    useEffect(() => {
      carregarDados()
      carregarObjetivos()
    }, [])

function calcularCategoria(nomeCategoria) {
    return transacoes
    .filter((t) => t.tipo === "SAIDA")
    .filter((t) => t.categoria === nomeCategoria)
    .reduce((total, t) => total + Number(t.valor), 0)
    }

function carregarObjetivos() {
  fetch("http://localhost:8080/objetivos")
    .then(response => response.json())
    .then(data => setObjetivos(data))
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

function adicionarObjetivo(event) {
  event.preventDefault()

  const novoObjetivo = {
    nome: nomeObjetivo,
    valorAlvo: Number(valorAlvo),
    valorAtual: Number(valorAtual),
    prazo: prazo,
    tipo: tipoObjetivo
  }

  fetch("http://localhost:8080/objetivos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoObjetivo)
  })
    .then(() => {
      carregarObjetivos()

      setNomeObjetivo("")
      setValorAlvo("")
      setValorAtual("")
      setPrazo("")
      setTipoObjetivo("COMPRA")
    })
}

function deletarObjetivo(id) {
  fetch(`http://localhost:8080/objetivos/${id}`, {
    method: "DELETE"
  })
    .then(() => carregarObjetivos())
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

            <button onClick={() => setTelaAtual("objetivos")}>
              Objetivos
            </button>

          </nav>

          {telaAtual === "dashboard" && (
            <Dashboard
              saldo={saldo}
              totalEntradas={totalEntradas}
              totalSaidas={totalSaidas}
              percentualConsumo={percentualConsumo}
              diagnosticoFinanceiro={diagnosticoFinanceiro}
              categoriasConsumo={categoriasConsumo}
              calcularCategoria={calcularCategoria}
            />
          )}

          {telaAtual === "transacoes" && (
            <Transactions
              descricao={descricao}
              setDescricao={setDescricao}
              valor={valor}
              setValor={setValor}
              tipo={tipo}
              setTipo={setTipo}
              categoria={categoria}
              setCategoria={setCategoria}
              categoriasFormulario={categoriasFormulario}
              transacoes={transacoes}
              adicionarTransacoes={adicionarTransacoes}
              deletarTransacao={deletarTransacao}
            />
          )}

      {telaAtual === "objetivos" && (
        <Goals
          objetivos={objetivos}
          nomeObjetivo={nomeObjetivo}
          setNomeObjetivo={setNomeObjetivo}
          valorAlvo={valorAlvo}
          setValorAlvo={setValorAlvo}
          valorAtual={valorAtual}
          setValorAtual={setValorAtual}
          prazo={prazo}
          setPrazo={setPrazo}
          tipoObjetivo={tipoObjetivo}
          setTipoObjetivo={setTipoObjetivo}
          adicionarObjetivo={adicionarObjetivo}
          deletarObjetivo={deletarObjetivo}
          calcularProgressoObjetivo={calcularProgressoObjetivo}
        />
      )}

  </main>
  </div>
    )
}
export default App

