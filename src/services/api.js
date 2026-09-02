const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function handleResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const errorMsg = data.message || data.error || `Erro (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

function apiFetch(url, options = {}) {
  const request = (token) =>
    fetch(`${API_URL}${url}`, {
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

    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    if (!refreshResponse.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("sessionExpired"));
      return response;
    }

    const tokens = await refreshResponse.json();
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);

    return request(tokens.accessToken);
  });
}

export function autenticar(email, senha) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  }).then(handleResponse);
}

export function registrar(nome, email, senha) {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nome, email, senha }),
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
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent("ajuda")}`, "_blank");
}

// ===== Recuperação de Senha =====

export function solicitarResetSenha(email) {
  return fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleResponse);
}

export function resetarSenha(token, senha) {
  return fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, senha }),
  }).then(handleResponse);
}
