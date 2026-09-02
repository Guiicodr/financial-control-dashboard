import { useState } from "react";
import { useTranslation } from "react-i18next";
import { autenticar, registrar } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Auth.css";

const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

function calcPasswordStrength(senha) {
  if (!senha) return { label: "", level: 0, color: "" };
  let score = 0;
  if (senha.length >= 6) score += 1;
  if (senha.length >= 10) score += 1;
  if (/[A-Z]/.test(senha)) score += 1;
  if (/[0-9]/.test(senha)) score += 1;
  if (/[^a-zA-Z0-9]/.test(senha)) score += 1;
  if (score <= 2) return { label: "Fraca", level: 1, color: "#ef4444" };
  if (score <= 3) return { label: "Média", level: 2, color: "#f59e0b" };
  return { label: "Forte", level: 3, color: "#10b981" };
}

function AuthPage({ onAuthenticated }) {
  const { t } = useTranslation();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const strength = calcPasswordStrength(senha);

  function usarContaTeste() {
    setEmail("teste@teste.com");
    setSenha("teste123");
    setModoCadastro(false);
    setErro("");
  }

  function enviar(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    const request = modoCadastro
      ? registrar(nome, email, senha).then(() => autenticar(email, senha))
      : autenticar(email, senha);

    request
      .then((data) => {
        if (!data.accessToken) throw new Error(data.message || data.error || t("auth.authError"));
        const usuario = data.usuario || data.user || {};
        const nomeUsuario = usuario.nome || usuario.name || data.name || nome || email.split("@")[0];
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken || "");
        localStorage.setItem("userEmail", usuario.email || email);
        localStorage.setItem("userName", nomeUsuario);
        onAuthenticated({ nome: nomeUsuario, email: usuario.email || email });
      })
      .catch((error) => setErro(error.message))
      .finally(() => setEnviando(false));
  }

  return (
    <main className="auth-container">
      <section className="auth-brand-section">
        <div className="brand-header">
          <span className="brand-logo">Finanly.</span>
        </div>
        <div className="brand-content">
          <span className="brand-badge">{t("auth.badge")}</span>
          <h1>{t("auth.headline")}</h1>
          <p>{t("auth.description")}</p>
        </div>
        <div className="brand-footer">
          <p>© {new Date().getFullYear()} Finanly Inc. {t("auth.rights")}</p>
        </div>
        <div className="glow-effect" />
      </section>
      <section className="auth-form-section">
        <div className="auth-card">
          <div className="auth-tabs">
            <button type="button" className={`tab-btn ${!modoCadastro ? "active" : ""}`} onClick={() => { setModoCadastro(false); setErro(""); }}>{t("auth.signIn")}</button>
            <button type="button" className={`tab-btn ${modoCadastro ? "active" : ""}`} onClick={() => { setModoCadastro(true); setErro(""); }}>{t("auth.createAccount")}</button>
          </div>
          <div className="auth-header">
            <h2>{t(modoCadastro ? "auth.createTitle" : "auth.welcome")}</h2>
            <p>{t(modoCadastro ? "auth.createSubtitle" : "auth.signInSubtitle")}</p>
          </div>
          <form onSubmit={enviar} className="auth-form">
            {modoCadastro && (
              <div className="input-group">
                <label htmlFor="name">{t("auth.name")}</label>
                <input id="name" required placeholder={t("auth.namePlaceholder")} value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email">{t("auth.email")}</label>
              <input id="email" type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="password">{t("auth.password")}</label>
              <div className="password-wrapper">
                <input id="password" type={showSenha ? "text" : "password"} minLength="6" required placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowSenha(!showSenha)} tabIndex={-1}>
                  {showSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {modoCadastro && senha && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl} className="strength-bar" style={{ background: lvl <= strength.level ? strength.color : "#1e293b" }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strength.color || "#94a3b8" }}>{strength.label}</span>
                </div>
              )}
            </div>
            {DEV_MODE && !modoCadastro && (
              <div className="auth-test-link">
                <button type="button" className="test-account-btn" onClick={usarContaTeste}>
                  🐛 Dev (conta teste)
                </button>
              </div>
            )}
            {erro && <div className="auth-error-badge">{erro}</div>}
            {!modoCadastro && (
              <div className="auth-forgot-password">
                <button type="button" className="forgot-link" onClick={() => alert("Em breve: recuperação de senha via e-mail")}>
                  Esqueceu a senha?
                </button>
              </div>
            )}
            <button type="submit" className="auth-submit-btn" disabled={enviando}>
              {enviando ? t("auth.connecting") : t(modoCadastro ? "auth.createAccount" : "auth.signIn")}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
export default AuthPage;
