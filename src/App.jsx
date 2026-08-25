import { MdDashboard } from "react-icons/md"
import { FaMoneyBillWave } from "react-icons/fa"
import { FaBullseye } from "react-icons/fa"
import { useEffect, useState } from "react"
import "./styles/App.css"

import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import AuthPage from "./components/AuthPage";

import {
  listarTransacoes,
  buscarSaldo,
  criarTransacao,
  deletarTransacaoPorId,
  listarObjetivos,
  criarObjetivo,
  deletarObjetivoPorId,
  listarRendas,
  criarRenda,
  deletarRendaPorId
} from "./services/api"
import { analisarExtrato } from "./services/api"
import { registrarMovimentoMeta as salvarMovimentoMeta } from "./services/api"

function App() {
  const [saldo, setSaldo] = useState(0)
  const [transacoes, setTransacoes] = useState([])
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState("ALIMENTACAO")
  const [telaAtual, setTelaAtual] = useState("dashboard")

  const [objetivos, setObjetivos] = useState([])
  const [nomeObjetivo, setNomeObjetivo] = useState("")
  const [valorAlvo, setValorAlvo] = useState("")
  const [valorAtual, setValorAtual] = useState("")
  const [prazo, setPrazo] = useState("")
  const [tipoObjetivo, setTipoObjetivo] = useState("COMPRA")
  const [rendas, setRendas] = useState([])
  const [descricaoRenda, setDescricaoRenda] = useState("")
  const [valorRenda, setValorRenda] = useState("")
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("accessToken")))
  const [emailUsuario] = useState(() => localStorage.getItem("userEmail") || "Guilherme")

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

  function carregarRendas() {
    listarRendas()
      .then((data) => {
        setRendas(data)
        return buscarSaldo()
      })
      .then(setSaldo)
  }


  useEffect(() => {
    if (!autenticado) return
    carregarDados()
    carregarObjetivos()
    carregarRendas()

    const abrirGoals = () => {
      setTelaAtual("objetivos")
    }
    const expirarSessao = () => setAutenticado(false)

    window.addEventListener(
      "openGoals",
      abrirGoals
    )
    window.addEventListener("sessionExpired", expirarSessao)

    return () => {
      window.removeEventListener(
        "openGoals",
        abrirGoals
      )
      window.removeEventListener("sessionExpired", expirarSessao)
    }
  }, [autenticado])

  function adicionarTransacoes(event) {
    event.preventDefault()

    const novaTransacao = {
      descricao,
      valor: Number(valor),
      tipo: "SAIDA",
      data: new Date().toISOString().split("T")[0],
      categoria
    }

    criarTransacao(novaTransacao)
      .then(() => {
        carregarDados()

        setDescricao("")
        setValor("")
        setCategoria("ALIMENTACAO")
      })
  }

  function deletarTransacao(id) {
    deletarTransacaoPorId(id)
      .then(() => carregarDados())
  }

  function importarTransacoes(transacoesImportadas) {
    return Promise.all(transacoesImportadas.map((transacao) => criarTransacao(transacao)))
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

  const totalRendas = rendas.reduce(
    (total, renda) => total + Number(renda.valor),
    0
  )

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "SAIDA")
    .reduce((total, t) => total + Number(t.valor), 0)

  const percentualConsumo = totalRendas === 0
    ? 0
    : (totalSaidas / totalRendas) * 100

  function gerarDiagnosticoFinanceiro() {

    if (totalRendas === 0) {
      return {
        titulo: "No financial data",
        mensagem: "Register your monthly income to start receiving financial insights.",
        status: "neutral"
      };
    }

    const food = calcularCategoria("ALIMENTACAO");
    const transport = calcularCategoria("TRANSPORTE");
    const leisure = calcularCategoria("LAZER");
    const education = calcularCategoria("ESTUDOS");
    const utilities = calcularCategoria("UTILITIES");

    const categories = [
      { nome: "Food", valor: food },
      { nome: "Transport", valor: transport },
      { nome: "Leisure", valor: leisure },
      { nome: "Education", valor: education },
      { nome: "Utilities", valor: utilities }
    ];

    const maiorCategoria = categories.reduce((a, b) =>
      a.valor > b.valor ? a : b
    );

    if (percentualConsumo >= 90) {
      return {
        titulo: "Critical spending",
        mensagem: `You have already spent ${percentualConsumo.toFixed(1)}% of your monthly income. Your biggest expense is ${maiorCategoria.nome}.`,
        status: "danger"
      };
    }

    if (percentualConsumo >= 70) {
      return {
        titulo: "Attention required",
        mensagem: `${maiorCategoria.nome} represents your largest expense this month. Consider reviewing this category.`,
        status: "warning"
      };
    }

    if (education > food && education > leisure) {
      return {
        titulo: "Great investment",
        mensagem: "Most of your spending is focused on education, which usually contributes to long-term growth.",
        status: "healthy"
      };
    }

    return {
      titulo: "Healthy financial profile",
      mensagem: "Your expenses are balanced and remain within a safe percentage of your income.",
      status: "healthy"
    };
  }

  const diagnosticoFinanceiro = gerarDiagnosticoFinanceiro()

  const categoriasConsumo = [
    { label: "Food", value: "ALIMENTACAO", limite: 25 },
    { label: "Bills", value: "OUTROS", limite: 30 },
    { label: "Transport", value: "TRANSPORTE", limite: 15 },
    { label: "Education", value: "ESTUDOS", limite: 15 },
    { label: "Leisure", value: "LAZER", limite: 10 }
  ]

  const categoriasFormulario = [
    { label: "Alimentação", value: "ALIMENTACAO" },
    { label: "Transporte", value: "TRANSPORTE" },
    { label: "Lazer", value: "LAZER" },
    { label: "Estudos", value: "ESTUDOS" },
    { label: "Outros", value: "OUTROS" }
  ]

  if (!autenticado) return <AuthPage onAuthenticated={() => setAutenticado(true)} />

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
            className={telaAtual === "Income" ? "active" : ""}
            onClick={() => setTelaAtual("Income")}
          >
            <FaMoneyBillWave />
            Income
          </button>


          <button
            className={telaAtual === "objetivos" ? "active" : ""}
            onClick={() => setTelaAtual("objetivos")}
          >
            <FaBullseye />
            Goals
          </button>
        </nav>
        <button className="user-card" type="button" onClick={() => setTelaAtual("perfil")} aria-label="Abrir perfil">
          <div className="avatar">G</div>

          <div>
            <strong>{emailUsuario}</strong>
            <span>Meu perfil</span>
          </div>
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
        </header>

        {telaAtual === "dashboard" && (
          <Dashboard
            saldo={saldo}
            totalRendas={totalRendas}
            totalSaidas={totalSaidas}
            transacoes={transacoes}
            percentualConsumo={percentualConsumo}
            diagnosticoFinanceiro={diagnosticoFinanceiro}
            categoriasConsumo={categoriasConsumo}
            calcularCategoria={calcularCategoria}
            rendas={rendas}
            objetivos={objetivos}
            calcularProgressoObjetivo={calcularProgressoObjetivo}
            registrarMovimentoMeta={(id, movimento) => salvarMovimentoMeta(id, movimento).then(carregarObjetivos)}
            abrirObjetivos={() => setTelaAtual("objetivos")}
          />
        )}

        {telaAtual === "transacoes" && (
          <Transactions
            descricao={descricao}
            setDescricao={setDescricao}
            valor={valor}
            setValor={setValor}
            categoria={categoria}
            setCategoria={setCategoria}
            categoriasFormulario={categoriasFormulario}
            transacoes={transacoes}
            adicionarTransacoes={adicionarTransacoes}
            deletarTransacao={deletarTransacao}
            importarTransacoes={importarTransacoes}
            analisarExtrato={analisarExtrato}
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

        {telaAtual === "Income" && (
          <Income
            rendas={rendas}
            descricaoRenda={descricaoRenda}
            setDescricaoRenda={setDescricaoRenda}
            valorRenda={valorRenda}
            setValorRenda={setValorRenda}
            carregarRendas={carregarRendas}
            criarRenda={criarRenda}
            deletarRendaPorId={deletarRendaPorId}
          />
        )}

        {telaAtual === "perfil" && (
          <Profile
            email={emailUsuario}
            voltar={() => setTelaAtual("dashboard")}
            sair={() => {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              setAutenticado(false)
            }}
          />
        )}
      </main>
    </div>
  )
}
export default App