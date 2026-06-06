import { MdDashboard } from "react-icons/md"
import { FaMoneyBillWave } from "react-icons/fa"
import { FaBullseye } from "react-icons/fa"
import { useEffect, useState } from "react"
import "./App.css"

import Dashboard from "./components/Dashboard"
import Transactions from "./components/Transactions"
import Goals from "./components/Goals"

import {
  listarTransacoes,
  buscarSaldo,
  criarTransacao,
  deletarTransacaoPorId,
  listarObjetivos,
  criarObjetivo,
  deletarObjetivoPorId
} from "./services/api"

function App() {
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

  const categoryIcons = {
    ALIMENTACAO: "🍔",
    TRANSPORTE: "🚗",
    LAZER: "🎮",
    ESTUDOS: "📚",
    OUTROS: "📦"
  }

  function carregarDados() {
    buscarSaldo()
      .then((data) => setSaldo(data))

    listarTransacoes()
      .then((data) => setTransacoes(data))
  }

  function carregarObjetivos() {
    listarObjetivos()
      .then((data) => setObjetivos(data))
  }

  useEffect(() => {
    carregarDados()
    carregarObjetivos()

    const abrirGoals = () => {
      setTelaAtual("objetivos")
    }

    window.addEventListener(
      "openGoals",
      abrirGoals
    )

    return () => {
      window.removeEventListener(
        "openGoals",
        abrirGoals
      )
    }
  }, [])

  function adicionarTransacoes(event) {
    event.preventDefault()

    const novaTransacao = {
      descricao: descricao,
      valor: Number(valor),
      tipo: tipo,
      data: new Date().toISOString().split("T")[0],
      categoria: categoria
    }

    criarTransacao(novaTransacao)
      .then(() => {
        carregarDados()

        setDescricao("")
        setValor("")
        setTipo("ENTRADA")
        setCategoria("ALIMENTACAO")
      })
  }

  function deletarTransacao(id) {
    deletarTransacaoPorId(id)
      .then(() => carregarDados())
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

    criarObjetivo(novoObjetivo)
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
    deletarObjetivoPorId(id)
      .then(() => carregarObjetivos())
  }

  function calcularCategoria(nomeCategoria) {
    return transacoes
      .filter((t) => t.tipo === "SAIDA")
      .filter((t) => t.categoria === nomeCategoria)
      .reduce((total, t) => total + Number(t.valor), 0)
  }

  function calcularProgressoObjetivo(valorAtual, valorAlvo) {
    if (valorAlvo === 0) {
      return 0
    }

    return (valorAtual / valorAlvo) * 100
  }

  const totalEntradas = transacoes
    .filter((t) => t.tipo === "ENTRADA")
    .reduce((total, t) => total + Number(t.valor), 0)

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "SAIDA")
    .reduce((total, t) => total + Number(t.valor), 0)

  const percentualConsumo = totalEntradas === 0
    ? 0
    : (totalSaidas / totalEntradas) * 100

  function gerarDiagnosticoFinanceiro() {
    if (totalEntradas === 0) {
      return {
        titulo: "Sem dados suficientes",
        mensagem: "Cadastre sua renda para acompanhar seu relatório.",
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

  const categoriasConsumo = [
    { label: "ALIMENTAÇÃO", value: "ALIMENTACAO" },
    { label: "LAZER", value: "LAZER" },
    { label: "TRANSPORTE", value: "TRANSPORTE" },
    { label: "ESTUDOS", value: "ESTUDOS" },
    { label: "OUTROS", value: "OUTROS" }
  ]

  const valoresCategorias = categoriasConsumo.map((categoria) =>
    calcularCategoria(categoria.value)
  )

  const maiorValorCategoria = Math.max(...valoresCategorias, 1)

  const categoriasFormulario = [
    { label: "Alimentação", value: "ALIMENTACAO" },
    { label: "Transporte", value: "TRANSPORTE" },
    { label: "Lazer", value: "LAZER" },
    { label: "Estudos", value: "ESTUDOS" },
    { label: "Salário", value: "SALARIO" },
    { label: "Outros", value: "OUTROS" }
  ]

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <h2>Finanly</h2>
          <span>Personal Financial Assistant</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={telaAtual === "dashboard" ? "active" : ""}
            onClick={() => setTelaAtual("dashboard")}
          >
            <MdDashboard />
            Dashboard
          </button>

          <button
            className={telaAtual === "transacoes" ? "active" : ""}
            onClick={() => setTelaAtual("transacoes")}
          >
            <FaMoneyBillWave />
            Transactions
          </button>

          <button
            className={telaAtual === "objetivos" ? "active" : ""}
            onClick={() => setTelaAtual("objetivos")}
          >
            <FaBullseye />
            Goals
          </button>
        </nav>
        <div className="user-card">
          <div className="avatar">G</div>

          <div>
            <strong>Guilherme</strong>
            <span>Developer</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
        </header>

        {telaAtual === "dashboard" && (
          <Dashboard
            saldo={saldo}
            totalEntradas={totalEntradas}
            totalSaidas={totalSaidas}
            percentualConsumo={percentualConsumo}
            diagnosticoFinanceiro={diagnosticoFinanceiro}
            categoriasConsumo={categoriasConsumo}
            calcularCategoria={calcularCategoria}
            objetivos={objetivos}
            calcularProgressoObjetivo={calcularProgressoObjetivo}
            abrirObjetivos={() => setTelaAtual("objetivos")}
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