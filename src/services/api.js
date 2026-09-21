const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Toda chamada HTTP passa por aqui.
 *
 * Sem timeout, uma API lenta (container do Railway acordando, rede móvel ruim)
 * deixava a tela em skeleton para sempre: a promise nunca resolvia nem
 * rejeitava. 15s é folgado para qualquer endpoint deste app.
 */
const TEMPO_LIMITE_MS = 15000;

function requisitar(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

  return fetch(url, { ...options, signal: controller.signal })
    .catch((error) => {
      if (error && error.name === "AbortError") {
        throw new Error("Tempo de resposta excedido. Verifique sua conexão e tente novamente.");
      }
      throw error;
    })
    .finally(() => clearTimeout(timer));
}

async function handleResponse(response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMsg = data.message || data.error || `Erro (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Renovação de token compartilhada (single flight).
 *
 * O dashboard dispara várias chamadas em paralelo; quando o access token
 * expirava, cada 401 abria um POST /auth/refresh próprio. Como o backend mantém
 * UM refresh token por usuário (deleteByUsuario em cada login/refresh), a
 * segunda renovação invalidava a primeira e a sessão caía sozinha. Aqui a
 * primeira chamada renova e as demais reaproveitam a mesma promise.
 */
let renovacaoEmAndamento = null;

function renovarAccessToken() {
  if (renovacaoEmAndamento) {
    return renovacaoEmAndamento;
  }

  renovacaoEmAndamento = requisitar(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null)
    .then((tokens) => {
      if (!tokens || !tokens.accessToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("sessionExpired"));
        return null;
      }

      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken || "");
      return tokens.accessToken;
    })
    .finally(() => {
      renovacaoEmAndamento = null;
    });

  return renovacaoEmAndamento;
}

function apiFetch(url, options = {}) {
  const request = (token) =>
    requisitar(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  const token = localStorage.getItem("accessToken");

  return request(token).then(async (response) => {
    if (response.status !== 401 || !localStorage.getItem("refreshToken")) {
      return response;
    }

    const novoToken = await renovarAccessToken();
    if (!novoToken) {
      return response;
    }

    return request(novoToken);
  });
}

export function autenticar(email, senha) {
  return requisitar(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  }).then(handleResponse);
}

export function registrar(nome, email, senha, aceiteVersao) {
  return requisitar(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // A versao dos documentos aceitos vai junto: e o que permite provar depois
    // QUAL texto o titular aceitou e QUANDO (LGPD art. 8, §1º).
    body: JSON.stringify({ name: nome, email, senha, aceiteVersao }),
  }).then(handleResponse);
}

export function listarTransacoes() {
  return apiFetch("/transacoes").then(handleResponse);
}

export function buscarSaldo() {
  return apiFetch("/transacoes/saldo").then(handleResponse);
}

export function criarTransacao(transacao) {
  return apiFetch("/transacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transacao),
  }).then(handleResponse);
}

export function deletarTransacaoPorId(id) {
  return apiFetch(`/transacoes/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}

export function listarObjetivos() {
  return apiFetch("/objetivos").then(handleResponse);
}

export function criarObjetivo(objetivo) {
  return apiFetch("/objetivos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objetivo),
  }).then(handleResponse);
}

export function deletarObjetivoPorId(id) {
  return apiFetch(`/objetivos/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}

export function listarRendas() {
  return apiFetch("/income").then(handleResponse);
}

export function criarRenda(renda) {
  return apiFetch("/income", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(renda),
  }).then(handleResponse);
}

export function deletarRendaPorId(id) {
  return apiFetch(`/income/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}

export function buscarGastosMensais() {
  return apiFetch("/transacoes/monthly").then(handleResponse);
}

export function listarNotificacoes() {
  return apiFetch("/notificacoes").then(handleResponse);
}

export function registrarMovimentoMeta(id, movimento) {
  return apiFetch(`/metas/movimentos/${id}`, {
    method: "POST",
    body: JSON.stringify(movimento),
  }).then(handleResponse);
}

export function listarAlertasOrcamento() {
  return apiFetch("/orcamentos/alertas").then(handleResponse);
}

export function atualizarRenda(id, renda) {
  return apiFetch(`/income/${id}`, {
    method: "PUT",
    body: JSON.stringify(renda),
  }).then(handleResponse);
}

// ===== WhatsApp =====

export function consultarWhatsapp() {
  return apiFetch("/usuario/whatsapp").then(handleResponse);
}

export function vincularWhatsapp(telefone) {
  return apiFetch("/usuario/whatsapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telefone }),
  }).then(handleResponse);
}

/** Abre o chat do bot no WhatsApp (wa.me) com a mensagem inicial. */
export function abrirChatWhatsapp(botNumero) {
  const numero = botNumero || import.meta.env.VITE_WHATSAPP_BOT_NUMBER || "";
  if (!numero) return;
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent("ajuda")}`, "_blank", "noopener,noreferrer");
}

// ===== Recuperação de Senha =====

export function solicitarResetSenha(email) {
  return requisitar(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleResponse);
}

export function resetarSenha(token, senha) {
  return requisitar(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, senha }),
  }).then(handleResponse);
}
// ===== Edicao / Orcamentos (endpoints aditivos da API) =====

export function atualizarTransacao(id, transacao) {
  return apiFetch(`/transacoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(transacao),
  }).then(handleResponse);
}

export function listarOrcamentos() {
  return apiFetch("/orcamentos").then(handleResponse);
}

// ===== Cartoes de credito =====

export function listarCartoes() {
  return apiFetch("/cartoes").then(handleResponse);
}

export function criarCartao(cartao) {
  return apiFetch("/cartoes", {
    method: "POST",
    body: JSON.stringify(cartao),
  }).then(handleResponse);
}

export function deletarCartao(id) {
  return apiFetch(`/cartoes/${id}`, { method: "DELETE" }).then(handleResponse);
}
// ===== Relatorios / Projecoes =====

export function buscarProjecaoSaldo(meses = 6) {
  return apiFetch(`/projecoes/saldo?meses=${meses}`).then(handleResponse);
}

export function criarOrcamento(orcamento) {
  return apiFetch("/orcamentos", {
    method: "POST",
    body: JSON.stringify(orcamento),
  }).then(handleResponse);
}

// ===== Direitos do titular (LGPD art. 18) =====

/**
 * Acesso e portabilidade (art. 18, II e V): devolve, em JSON, tudo o que a API
 * guarda sobre quem chamou. O download do arquivo e montado na tela de perfil.
 */
export function exportarMeusDados() {
  return apiFetch("/usuario/dados").then(handleResponse);
}

/**
 * Eliminacao da conta e do historico (art. 18, VI). Exige a senha porque a
 * acao e irreversivel e o token de sessao pode estar em um navegador alheio.
 */
export function excluirConta(senha) {
  return apiFetch("/usuario", {
    method: "DELETE",
    body: JSON.stringify({ senha }),
  }).then(handleResponse);
}

/** Revogacao do vinculo de WhatsApp, sem excluir a conta (art. 18, IX). */
export function desvincularWhatsapp() {
  return apiFetch("/usuario/whatsapp", { method: "DELETE" }).then(handleResponse);
}
