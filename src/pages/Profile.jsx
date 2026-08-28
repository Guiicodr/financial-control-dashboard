import { useEffect, useState } from "react";
import { FaArrowLeft, FaRightFromBracket, FaUser, FaWhatsapp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { abrirChatWhatsapp, consultarWhatsapp, vincularWhatsapp } from "../services/api";
import "../styles/pages/Profile.css";

function Profile({ nome, email, voltar, sair }) {
  const { t, i18n } = useTranslation();

  const trocarIdioma = (event) => {
    const idioma = event.target.value;
    i18n.changeLanguage(idioma);
    localStorage.setItem("language", idioma);
  };

  const [waTelefone, setWaTelefone] = useState("");
  const [waVinculado, setWaVinculado] = useState(false);
  const [waBotNumero, setWaBotNumero] = useState("");
  const [waSalvando, setWaSalvando] = useState(false);
  const [waMensagem, setWaMensagem] = useState("");

  useEffect(() => {
    consultarWhatsapp()
      .then((dados) => {
        setWaTelefone(dados.telefone || "");
        setWaVinculado(Boolean(dados.vinculado));
        setWaBotNumero(dados.botNumero || "");
      })
      .catch(() => {});
  }, []);

  function salvarWhatsapp(event) {
    event.preventDefault();
    setWaMensagem("");
    setWaSalvando(true);
    vincularWhatsapp(waTelefone)
      .then((dados) => {
        setWaVinculado(true);
        setWaTelefone(dados.telefone || waTelefone);
        setWaBotNumero(dados.botNumero || waBotNumero);
        setWaMensagem(dados.mensagem || "Número vinculado!");
      })
      .catch((error) => setWaMensagem(error.message))
      .finally(() => setWaSalvando(false));
  }

  return (
    <div className="profile-page">
      <button className="profile-back" type="button" onClick={voltar}>
        <FaArrowLeft /> {t("profile.back")}
      </button>

      <header className="profile-heading">
        <span className="profile-kicker">{t("profile.kicker")}</span>
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </header>

      <section className="profile-hero">
        <div className="profile-avatar"><FaUser /></div>
        <div>
          <span className="profile-label">{t("profile.user")}</span>
          <h2>{nome || email}</h2>
          <p>{t("brand.account")}</p>
        </div>
      </section>

      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-card-icon"><FaUser /></div>
          <div>
            <h3>{t("profile.preferences")}</h3>
            <p>{t("profile.currency")}</p>
            <p>{t("profile.notifications")}</p>
            <label className="language-preference" htmlFor="language">
              <span>{t("profile.language")}</span>
              <select id="language" value={i18n.language} onChange={trocarIdioma}>
                <option value="pt-BR">{t("profile.portuguese")}</option>
                <option value="en-US">{t("profile.english")}</option>
              </select>
              <small>{t("profile.languageDescription")}</small>
            </label>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-card-icon whatsapp-icon"><FaWhatsapp /></div>
          <div>
            <h3>WhatsApp</h3>
            <p>
              Registre seus gastos pelo chat: envie <strong>gastei 25,50 no almoço</strong> e o
              bot responde com o valor e a categoria. Comandos: <em>saldo</em> e <em>ajuda</em>.
            </p>
            <form className="whatsapp-form" onSubmit={salvarWhatsapp}>
              <input
                type="tel"
                placeholder="Seu número com DDI (5511999998888)"
                value={waTelefone}
                onChange={(e) => setWaTelefone(e.target.value)}
                required
              />
              <button type="submit" disabled={waSalvando}>
                {waSalvando ? "Salvando..." : waVinculado ? "Atualizar" : "Vincular"}
              </button>
            </form>
            {waMensagem && <small className="whatsapp-status">{waMensagem}</small>}
            {waVinculado && waBotNumero ? (
              <button
                type="button"
                className="whatsapp-open-btn"
                onClick={() => abrirChatWhatsapp(waBotNumero)}
              >
                <FaWhatsapp /> Abrir chat do bot
              </button>
            ) : (
              <small className="whatsapp-hint">
                Vincule seu número para começar. O botão do chat aparece quando o número do bot
                estiver configurado (WHATSAPP_BOT_NUMBER no Railway).
              </small>
            )}
          </div>
        </section>
      </div>

      <button className="profile-logout" type="button" onClick={sair}>
        <FaRightFromBracket /> {t("profile.logout")}
      </button>
    </div>
  );
}

export default Profile;