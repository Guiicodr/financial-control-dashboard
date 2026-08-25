import { FaArrowLeft, FaRightFromBracket, FaShieldHalved, FaUser } from "react-icons/fa6";
import "../styles/pages/Profile.css";

function Profile({ email, voltar, sair }) {
    return (
        <div className="profile-page">
            <button className="profile-back" type="button" onClick={voltar}><FaArrowLeft /> Dashboard</button>
            <header className="profile-heading"><span className="profile-kicker">Conta pessoal</span><h1>Seu perfil</h1><p>Gerencie seus dados e a segurança do seu espaço financeiro.</p></header>
            <section className="profile-hero"><div className="profile-avatar"><FaUser /></div><div><span className="profile-label">Usuário</span><h2>{email || "Guilherme"}</h2><p>Conta Finanly</p></div></section>
            <div className="profile-grid"><section className="profile-card"><div className="profile-card-icon"><FaUser /></div><div><h3>Preferências</h3><p>Moeda padrão: Real brasileiro (BRL)</p><p>Notificações internas: ativadas</p></div></section></div>
            <button className="profile-logout" type="button" onClick={sair}><FaRightFromBracket /> Sair da conta</button>
        </div>
    );
}

export default Profile;
