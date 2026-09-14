import { MdDashboard } from "react-icons/md"
import { FaMoneyBillWave } from "react-icons/fa"
import { FaBullseye } from "react-icons/fa"
import { FaWhatsapp, FaBriefcase } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "./styles/App.css"

import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import AuthPage from "./components/AuthPage";
import AppShell from "./components/layout/AppShell";
import { useTheme } from "./hooks/useTheme";

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
  atualizarRenda,
  deletarRendaPorId
} from "./services/api"
import { registrarMovimentoMeta as salvarMovimentoMeta } from "./services/api"
import { consultarWhatsapp, abrirChatWhatsapp } from "./services/api"

const NAV_ITEMS = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: <MdDashboard /> },
  { id: "transacoes", labelKey: "nav.transactions", icon: <FaMoneyBillWave /> },
  { id: "rendas", labelKey: "nav.income", icon: <FaBriefcase /> },
  { id: "metas", labelKey: "nav.goals", icon: <FaBullseye /> },
];

function App() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
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
  const [waBotNumero, setWaBotNumero] = useState("")
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("accessToken")))
  const [usuario, setUsuario] = useState(() => ({ nome: localStorage.getItem("userName") || localStorage.getItem("userEmail")?.split("@")[0] || "", email: localStorage.getItem("userEmail") || "" }))


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
    consultarWhatsapp().then((dados) => setWaBotNumero(dados.botNumero || "")).catch(() => {})

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
        titulo: t("dashboard.noData"),
        mensagem: t("dashboard.noDataMessage"),
        status: "neutral"
      };
    }

    const food = calcularCategoria("ALIMENTACAO");
    const transport = calcularCategoria("TRANSPORTE");
    const leisure = calcularCategoria("LAZER");
    const education = calcularCategoria("ESTUDOS");
    const utilities = calcularCategoria("UTILITIES");

    const categories = [
      { nome: t("charts.food"), valor: food }, { nome: t("charts.transport"), valor: transport }, { nome: t("charts.leisure"), valor: leisure }, { nome: t("charts.education"), valor: education }, { nome: t("charts.bills"), valor: utilities }
    ];

    const maiorCategoria = categories.reduce((a, b) =>
      a.valor > b.valor ? a : b
    );

    if (percentualConsumo >= 90) {
      return {
        titulo: t("dashboard.critical"), mensagem: t("dashboard.criticalMessage", { percent: percentualConsumo.toFixed(1), category: maiorCategoria.nome }),
        status: "danger"
      };
    }

    if (percentualConsumo >= 70) {
      return {
        titulo: t("dashboard.attention"), mensagem: t("dashboard.attentionMessage", { category: maiorCategoria.nome }),
        status: "warning"
      };
    }

    if (education > food && education > leisure) {
      return {
        titulo: t("dashboard.investment"), mensagem: t("dashboard.investmentMessage"),
        status: "healthy"
      };
    }

    return {
      titulo: t("dashboard.healthy"), mensagem: t("dashboard.healthyMessage"),
      status: "healthy"
    };
  }

  const diagnosticoFinanceiro = gerarDiagnosticoFinanceiro()

  const categoriasConsumo = [
    { label: t("categories.ALIMENTACAO"), value: "ALIMENTACAO", limite: 25 }, { label: t("categories.OUTROS"), value: "OUTROS", limite: 30 }, { label: t("categories.TRANSPORTE"), value: "TRANSPORTE", limite: 15 }, { label: t("categories.ESTUDOS"), value: "ESTUDOS", limite: 15 }, { label: t("categories.LAZER"), value: "LAZER", limite: 10 }
  ]

  const categoriasFormulario = [
    { label: t("categories.ALIMENTACAO"), value: "ALIMENTACAO" }, { label: t("categories.TRANSPORTE"), value: "TRANSPORTE" }, { label: t("categories.LAZER"), value: "LAZER" }, { label: t("categories.ESTUDOS"), value: "ESTUDOS" }, { label: t("categories.OUTROS"), value: "OUTROS" }
  ]

  if (!autenticado) return <AuthPage onAuthenticated={(dados) => { setUsuario(dados); setAutenticado(true) }} />

  return (
    <AppShell
      navItems={NAV_ITEMS}
      activeId={telaAtual}
      onNavigate={setTelaAtual}
      user={usuario}
      onOpenProfile={() => setTelaAtual("perfil")}
      theme={theme}
      onToggleTheme={toggleTheme}
      syncLabel={t("common.sync")}
      fab={
        waBotNumero ? (
          <button
            className="whatsapp-fab"
            type="button"
            aria-label={t("common.whatsappFab")}
            title={t("common.whatsappFab")}
            onClick={() => abrirChatWhatsapp(waBotNumero)}
          >
            <FaWhatsapp />
          </button>
        ) : null
      }
    >
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
          abrirObjetivos={() => setTelaAtual("metas")}
          nomeUsuario={usuario.nome}
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
        />
      )}

      {telaAtual === "metas" && (
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
          registrarMovimentoMeta={(id, movimento) => salvarMovimentoMeta(id, movimento).then(carregarObjetivos)}
        />
      )}

      {telaAtual === "rendas" && (
        <Income
          rendas={rendas}
          carregarRendas={carregarRendas}
          criarRenda={criarRenda}
          atualizarRenda={atualizarRenda}
          deletarRendaPorId={deletarRendaPorId}
        />
      )}

      {telaAtual === "perfil" && (
        <Profile
          nome={usuario.nome}
          email={usuario.email}
          voltar={() => setTelaAtual("dashboard")}
          sair={() => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userName")
            localStorage.removeItem("userEmail")
            setAutenticado(false)
          }}
        />
      )}
    </AppShell>
  )
}

export default App
