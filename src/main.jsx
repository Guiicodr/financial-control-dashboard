import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css"
import "./styles/base/variables.css"
import App from './App.jsx'
import "./styles/index.css"
import "./styles/variables.css"
import "./styles/animations.css"
import "./styles/components.css"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
