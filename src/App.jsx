import { MdDashboard } from "react-icons/md"
import { FaMoneyBillWave } from "react-icons/fa"
import { FaBullseye } from "react-icons/fa"
import { FaWhatsapp, FaBriefcase, FaWallet, FaChartColumn } from "react-icons/fa6"
import { Suspense, lazy, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
// As paginas entram por import dinamico: cada uma vira um chunk proprio em vez
// de ir toda a aplicacao num bundle unico. O recharts (graficos de Dashboard e
// Relatorios) sai num chunk compartilhado que so e baixado quando uma dessas
// telas abre; motion (Dock) e ogl (Aurora das telas iniciais) entram no bundle
// inicial porque a casca e as telas publicas aparecem no primeiro paint.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Income = lazy(() => import("./pages/Income"));
const Goals = lazy(() => import("./pages/Goals"));
const Profile = lazy(() => import("./pages/Profile"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Wallets = lazy(() => import("./pages/Wallets"));
const Reports = lazy(() => import("./pages/Reports"));
// Documentos legais: chunk proprio, baixado so quando o titular abre os Termos
// ou o Aviso de Privacidade (nao entram no primeiro paint).
const Legal = lazy(() => import("./pages/Legal"));
import AuthPage from "./components/AuthPage";
import HomePage from "./components/home/HomePage";
import AppShell from "./components/layout/AppShell";
import TransactionModal from "./components/transactions/TransactionModal";
import AuroraBackground from "./components/ui/AuroraBackground";
import ToastHost from "./components/ui/ToastHost";
import Skeleton from "./components/ui/Skeleton";
import { pushToast } from "./lib/toast";
import { trocarTela } from "./lib/viewTransition";
import { useTheme } from "./hooks/useTheme";

import {
  listarTransacoes,
  buscarSaldo,
  criarTransacao,
  deletarTransacaoPorId,
  atualizarTransacao,
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
  { id: "carteiras", labelKey: "nav.wallets", icon: <FaWallet /> },
  { id: "relatorios", labelKey: "nav.reports", icon: <FaChartColumn /> },
  { id: "rendas", labelKey: "nav.income", icon: <FaBriefcase /> },
  { id: "metas", labelKey: "nav.goals", icon: <FaBullseye /> },
];

/**
 * Documento legal pedido na URL ("#/termos" ou "#/privacidade").
 *
 * O app nao usa roteador: a navegacao e por estado. Ler o hash na primeira
 * pintura permite compartilhar o link do documento (util para publicar os
 * Termos em bio, e-mail ou suporte) sem trazer uma dependencia nova.
 */
function documentoDoHash() {
  const hash = String(window.location.hash || "").replace(/^#\/?/, "").toLowerCase();
  if (hash === "termos") return "termos";
  if (hash === "privacidade") return "privacidade";
  return null;
}

/**
 * Fallback do Suspense: exibido apenas enquanto o chunk da pagina aberta esta
 * sendo baixado (nas trocas seguintes fica em cache).
 */
function PaginaCarregando() {
  return (
    <div style={{ display: "grid", gap: "16px", padding: "24px 0" }} aria-busy="true">
      <Skeleton height={112} />
      <Skeleton height={240} />
    </div>
  );
}

function App() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [saldo, setSaldo] = useState(0)
  const [transacoes, setTransacoes] = useState([])
  const [telaAtual, setTelaAtual] = useState("dashboard")
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState(null)

  const [objetivos, setObjetivos] = useState([])
  const [rendas, setRendas] = useState([])
  const [waBotNumero, setWaBotNumero] = useState("")
  const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("accessToken")))
  const [usuario, setUsuario] = useState(() => ({ nome: localStorage.getItem("userName") || localStorage.getItem("userEmail")?.split("@")[0] || "", email: localStorage.getItem("userEmail") || "" }))
  // Area publica: "inicio" (primeira tela) | "entrar" | "cadastro".
  const [vistaPublica, setVistaPublica] = useState("inicio")
  // Documento legal aberto (LGPD: acesso ao texto dos Termos e do Aviso). Vale
  // tanto para quem esta deslogado quanto para quem esta no app.
  const [documentoLegal, setDocumentoLegal] = useState(() => documentoDoHash())

  /** Abre um documento legal e reflete a escolha na URL (link compartilhavel). */
  function abrirDocumento(documento) {
    trocarTela(() => {
      setDocumentoLegal(documento)
      window.location.hash = documento ? "/" + documento : ""
    })
  }

  /** Volta para a tela de onde o documento foi aberto e limpa o hash. */
  function fecharDocumento() {
    trocarTela(() => {
      setDocumentoLegal(null)
      if (documentoDoHash()) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search)
      }
    })
  }

  /** Navegacao entre as telas publicas (inicio / entrar / criar conta). */
  function irParaVistaPublica(vista) {
    trocarTela(() => setVistaPublica(vista))
  }


  function carregarDados() {
    buscarSaldo()
      .then((data) => setSaldo(data))
      .catch(() => pushToast(t("common.loadError"), "danger"))

    listarTransacoes()
      .then((data) => {
        setTransacoes(data)
        setCarregando(false)
      })
      .catch(() => {
        // Sem o catch, uma falha de rede deixava a lista presa no skeleton.
        setCarregando(false)
        pushToast(t("common.loadError"), "danger")
      })
  }

  function carregarObjetivos() {
    listarObjetivos()
      .then((data) => setObjetivos(data))
      .catch(() => pushToast(t("common.loadError"), "danger"))
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

  

  


  function adicionarObjetivo(objetivo) {
    return criarObjetivo(objetivo).then(() => carregarObjetivos())
  }

  function deletarObjetivo(id) {
    return deletarObjetivoPorId(id).then(() => carregarObjetivos())
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

  function criarLancamento(dados) {
    if (dados.tipo === "RECEITA") {
      return criarRenda({
        descricao: dados.descricao,
        valor: dados.valor,
        tipo: "EXTRA",
        data: dados.data,
      }).then(() => {
        carregarRendas()
        pushToast(t("tx.savedIncome"))
      })
    }

    return criarTransacao({
      descricao: dados.descricao,
      valor: dados.valor,
      tipo: "SAIDA",
      data: dados.data,
      categoria: dados.categoria,
    }).then(() => {
      carregarDados()
      pushToast(t("tx.savedExpense"))
    })
  }

  function editarLancamento(dados) {
    return atualizarTransacao(dados.id, {
      descricao: dados.descricao,
      valor: dados.valor,
      tipo: "SAIDA",
      data: dados.data,
      categoria: dados.categoria,
    }).then(() => {
      carregarDados()
      pushToast(t("tx.savedEdit"))
    })
  }

  function excluirLancamento(item) {
    if (item.origem === "RECEITA") {
      return deletarRendaPorId(item.id).then(() => {
        carregarRendas()
        pushToast(t("tx.deleted"), "warning")
      })
    }
    return deletarTransacaoPorId(item.id).then(() => {
      carregarDados()
      pushToast(t("tx.deleted"), "warning")
    })
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

  // Documentos legais tem precedencia sobre as demais telas: o titular precisa
  // conseguir ler o texto que aceitou (ou que rege o uso) sem sair do contexto.
  if (documentoLegal) {
    return (
      <Suspense fallback={<PaginaCarregando />}>
        <Legal
          documento={documentoLegal}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpen={abrirDocumento}
          onBack={fecharDocumento}
        />
      </Suspense>
    )
  }

  // Area publica: a primeira tela e o hero; o formulario de acesso aparece
  // somente depois de escolher "Entrar" ou "Criar conta".
  if (!autenticado) {
    return (
      <>
        {/* A Aurora vive UMA vez aqui. Antes cada tela montava a sua, entao
            entrar/sair do formulario recriava o contexto WebGL e o app dava uma
            engasgada visivel (mais obvia na build). Com a instancia unica a
            animacao continua de onde estava e a troca so mexe no conteudo. */}
        <AuroraBackground theme={theme} />

        {vistaPublica === "inicio" ? (
          <HomePage
            theme={theme}
            onToggleTheme={toggleTheme}
            onAccess={irParaVistaPublica}
            onOpenLegal={abrirDocumento}
          />
        ) : (
          <AuthPage
            initialMode={vistaPublica}
            theme={theme}
            onToggleTheme={toggleTheme}
            onGoHome={() => irParaVistaPublica("inicio")}
            onOpenLegal={abrirDocumento}
            onAuthenticated={(dados) => trocarTela(() => { setUsuario(dados); setAutenticado(true) })}
          />
        )}
      </>
    )
  }

  return (
    <>
    <AppShell
      navItems={NAV_ITEMS}
      activeId={telaAtual}
      onNavigate={setTelaAtual}
      user={usuario}
      onOpenProfile={() => setTelaAtual("perfil")}
      theme={theme}
      onToggleTheme={toggleTheme}
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
      <Suspense fallback={<PaginaCarregando />}>
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
          theme={theme}
          onNewTransaction={() => setModal({ mode: "create" })}
          onOpenTransactions={() => setTelaAtual("transacoes")}
          onOpenReports={() => setTelaAtual("relatorios")}
        />
      )}

      {telaAtual === "transacoes" && (
        <Transactions
          transacoes={transacoes}
          rendas={rendas}
          loading={carregando}
          onNew={() => setModal({ mode: "create" })}
          onEdit={(item) => setModal({ mode: "edit", item: item })}
          onDelete={excluirLancamento}
        />
      )}

      {telaAtual === "carteiras" && (
        <Wallets saldo={saldo} objetivos={objetivos} />
      )}

      {telaAtual === "relatorios" && (
        <Reports transacoes={transacoes} rendas={rendas} theme={theme} />
      )}

      {telaAtual === "metas" && (
        <Goals
          objetivos={objetivos}
          adicionarObjetivo={adicionarObjetivo}
          deletarObjetivo={deletarObjetivo}
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
          onOpenLegal={abrirDocumento}
          voltar={() => setTelaAtual("dashboard")}
          sair={() => trocarTela(() => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userName")
            localStorage.removeItem("userEmail")
            setVistaPublica("inicio")
            setAutenticado(false)
          })}
        />
      )}
      </Suspense>
    </AppShell>

      <TransactionModal
        open={Boolean(modal)}
        initial={modal && modal.mode === "edit" ? modal.item : null}
        onClose={() => setModal(null)}
        onSubmit={modal && modal.mode === "edit" ? editarLancamento : criarLancamento}
      />
      <ToastHost />
    </>
  )
}

export default App
