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
| **Desktop** | >1024px | Layout completo com sidebar fixa |
| **Tablet** | 768px - 1024px | Sidebar reduzida, grid 2 colunas |
| **Mobile** | <768px | Sidebar como overlay com toggle, grid adaptável |
| **Mobile pequeno** | <480px | Grid 1 coluna, elementos compactados |

### Funcionalidades Responsivas

- **Sidebar adaptável**: em telas menores, vira um menu lateral deslizante com overlay
- **Botão hamburger**: aparece apenas em dispositivos móveis para abrir/fechar o menu
- **Grids flexíveis**: os cards de overview adaptam-se de 4 para 2 para 1 coluna
- **Formulários**: campos organizados em coluna única no mobile
- **Cards e ícones**: dimensionados proporcionalmente para caber em qualquer tela
- **Botão WhatsApp**: reposicionado e redimensionado em telas pequenas

---