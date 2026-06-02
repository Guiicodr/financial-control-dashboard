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