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

export function listarRendas() {
  return fetch(`${API_URL}/income`)
    .then((response) => response.json())
}

export function criarRenda(renda) {
  return fetch(`${API_URL}/income`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(renda)
  }).then((response) => response.json())
}

export function deletarRendaPorId(id) {
  return fetch(`${API_URL}/income/${id}`, {
    method: "DELETE"
  })
}