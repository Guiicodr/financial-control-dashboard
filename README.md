# Financial Dashboard - Frontend

Frontend for a personal financial assistant built with React and Vite.

The application allows users to view financial data, register transactions, track expenses by category, and manage financial goals with visual progress indicators.

## Features

- Financial dashboard with general overview
- Total income, total expenses, available balance, and income consumption rate
- Financial diagnosis with visual status
- Transaction creation and listing
- Transaction deletion
- Financial categories
- Goal creation and listing
- Visual progress bar for financial goals
- Integration with a Spring Boot REST API

## Screens

### Dashboard

Displays the user's financial overview, including:

- Total income
- Total expenses
- Available balance
- Income consumption percentage
- Financial diagnosis
- Spending by category

### Transactions

Allows users to:

- Create income and expense transactions
- Select transaction categories
- List transactions
- Delete transactions

### Goals

Allows users to:

- Create financial goals
- Set a target amount
- Set the current saved amount
- Define a deadline
- Track progress with a visual progress bar
- Delete goals

## Technologies

- React
- Vite
- JavaScript
- CSS
- Fetch API

## Project Structure

```text
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Goals.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
└── main.jsx
```

## 🔑 Test Credentials

The application comes with a pre-configured test account for quick access:

| Field | Value |
|---|---|
| **E-mail** | `teste@teste.com` |
| **Password** | `teste123` |

On the login page, click the **"Use test account"** button to auto-fill these credentials.

> 💡 The backend automatically creates this test user on startup via `DataInitializer`.

---

## Backend Integration

The frontend consumes a local REST API available at:

```text
http://localhost:8080
```

Main API routes used by the frontend:

```text
GET    /transacoes
POST   /transacoes
DELETE /transacoes/{id}
GET    /transacoes/saldo

GET    /objetivos
POST   /objetivos
DELETE /objetivos/{id}
```

## How to Run

1. Clone the repository:

```bash
git clone REPOSITORY_URL
```

2. Access the project folder:

```bash
cd financial-control-dashboard
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open the application in the browser:

```text
http://localhost:5173
```

or use the port displayed by Vite in the terminal.

## Requirements

The backend Spring Boot API must be running at:

```text
http://localhost:8080
```

## Status

In development.
## 📱 Responsividade

O frontend é totalmente responsivo e adaptável a diferentes tamanhos de tela:

### Breakpoints

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| **Desktop grande** | >1080px | Navbar no topo (Dock), conteúdo em até 1600px |
| **Tablet / notebook** | 721px - 1080px | Menu deslizante (hambúrguer) + barra inferior; grades viram uma coluna |
| **Mobile** | 561px - 720px | Barra inferior fixa, cards empilhados e campos em 16px (evita o zoom do iOS) |
| **Mobile pequeno** | 401px - 560px | Ações do cabeçalho em largura cheia e fim das larguras mínimas fixas |
| **Mobile estreito** | 320px - 400px | Grades de uma coluna, cards compactos e barra pública em duas linhas |

### Funcionalidades Responsivas

- **Sidebar adaptável**: em telas menores, vira um menu lateral deslizante com overlay
- **Botão hamburger**: aparece abaixo de 1081px para abrir/fechar o menu
- **Sem largura mínima fixa**: abaixo de 480px as grades (`dashboard-panels`, `metric-grid`, `reports-grid`, `goals-grid`, `profile-grid`, `wallet-summary`, `cc-grid`) trocam o `minmax(Npx, 1fr)` por uma coluna real — é o que evitava o corte lateral nos aparelhos de 320px
- **Diálogos com rolagem**: as caixas de formulário limitam a altura útil (`100dvh`) e rolam por dentro, com as ações empilhadas em largura cheia: o lançamento continua acessível com o teclado aberto ou na paisagem
- **Campos em 16px no mobile**: o token `--fs-input-touch` evita o zoom automático do Safari (iOS) ao focar um input
- **Área segura**: barras fixas, conteúdo e botão do WhatsApp respeitam `env(safe-area-inset-*)` (notch e cantos arredondados)

- **Grids flexíveis**: os cards de overview adaptam-se de 4 para 2 para 1 coluna
- **Formulários**: campos organizados em coluna única no mobile
- **Cards e ícones**: dimensionados proporcionalmente para caber em qualquer tela
- **Botão WhatsApp**: reposicionado e redimensionado em telas pequenas

---