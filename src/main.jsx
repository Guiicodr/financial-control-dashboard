import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css"
import "./styles/tokens.css"
import App from './App.jsx'
import "./i18n";

// Aplica o tema salvo antes do primeiro render para evitar flash de cor.
const storedTheme = localStorage.getItem("theme");
document.documentElement.setAttribute("data-theme", storedTheme === "light" ? "light" : "dark");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
