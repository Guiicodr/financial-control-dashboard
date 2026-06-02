const API_URL = "http://localhost:8080"

export function listarTransacoes() {
  return fetch(`${API_URL}/transacoes`)
    .then(response => response.json())
}

export function buscarSaldo() {
  return fetch(`${API_URL}/transacoes/saldo`)
    .then(response => response.json())
}

export function criarTransacao(transacao) {
  return fetch(`${API_URL}/transacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(transacao)
  })
}

export function deletarTransacaoPorId(id) {
  return fetch(`${API_URL}/transacoes/${id}`, {
    method: "DELETE"
  })
}

export function listarObjetivos() {
  return fetch(`${API_URL}/objetivos`)
    .then(response => response.json())
}

export function criarObjetivo(objetivo) {
  return fetch(`${API_URL}/objetivos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(objetivo)
  })
}

export function deletarObjetivoPorId(id) {
  return fetch(`${API_URL}/objetivos/${id}`, {
    method: "DELETE"
  })
}