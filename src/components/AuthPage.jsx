import { useState } from "react";
import { autenticar, registrar } from "../services/api";
import "../styles/Auth.css";

function AuthPage({ onAuthenticated }) {
    const [modoCadastro, setModoCadastro] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    function enviar(event) {
        event.preventDefault();
        setErro("");
        setEnviando(true);

        const request = modoCadastro
            ? registrar(email, senha).then(() => autenticar(email, senha))
            : autenticar(email, senha);

        request
            ? request
                .then((data) => {
                    if (!data.accessToken) {
                        throw new Error(data.message || "Não foi possível autenticar");
                    }
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("userEmail", email);
                    onAuthenticated();
                })
                .catch((error) => setErro(error.message))
                .finally(() => setEnviando(false))
            : setEnviando(false);
    }

    return (
        <main className="auth-container">
            {/* Coluna Esquerda - Apresentação da Marca */}
            <section className="auth-brand-section">
                <div className="brand-header">
                    <span className="brand-logo">Finanly.</span>
                </div>

                <div className="brand-content">
                    <span className="brand-badge">Financial Intelligence</span>
                    <h1>Take full control of your wealth.</h1>
                    <p>
                        Track incomes, expenses, set custom financial goals, and monitor your investment assets in a sleek, isolated workspace.
                    </p>
                </div>

                <div className="brand-footer">
                    <p>© {new Date().getFullYear()} Finanly Inc. All rights reserved.</p>
                </div>

                {/* Efeito Visual Glow */}
                <div className="glow-effect" />
            </section>

            {/* Coluna Direita - Formulário */}
            <section className="auth-form-section">
                <div className="auth-card">
                    {/* Alternador Superior (Tabs) */}
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${!modoCadastro ? "active" : ""}`}
                            onClick={() => {
                                setModoCadastro(false);
                                setErro("");
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${modoCadastro ? "active" : ""}`}
                            onClick={() => {
                                setModoCadastro(true);
                                setErro("");
                            }}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="auth-header">
                        <h2>{modoCadastro ? "Create your account" : "Welcome back"}</h2>
                        <p>
                            {modoCadastro
                                ? "Start managing your personal finances today."
                                : "Enter your credentials to access your workspace."}
                        </p>
                    </div>

                    <form onSubmit={enviar} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                minLength="6"
                                required
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                        {erro && <div className="auth-error-badge">{erro}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={enviando}>
                            {enviando
                                ? "Connecting..."
                                : modoCadastro
                                    ? "Create account"
                                    : "Sign in"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default AuthPage;