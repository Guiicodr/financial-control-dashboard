import { useEffect, useState } from "react";
import { FaDownload, FaRightFromBracket, FaShieldHalved, FaTrash, FaUser, FaWhatsapp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {
  abrirChatWhatsapp,
  consultarWhatsapp,
  desvincularWhatsapp,
  excluirConta,
  exportarMeusDados,
  vincularWhatsapp,
} from "../services/api";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";
import LegalLinks from "../components/legal/LegalLinks";
import { LEGAL_UPDATED_AT, LEGAL_VERSION } from "../lib/legal";
import { pushToast } from "../lib/toast";
import "../styles/pages/profile.css";

/**
 * Perfil: dados da conta, idioma e vinculo do WhatsApp. Todo texto sai do i18n
 * (o idioma e trocado aqui e fica salvo em localStorage) e as cores vem dos
 * tokens, entao a tela acompanha o tema claro e escuro.
 */
function Profile({ nome, email, voltar, sair, onOpenLegal = () => {} }) {
  const { t, i18n } = useTranslation();
  const [waTelefone, setWaTelefone] = useState("");
  const [waVinculado, setWaVinculado] = useState(false);
  const [waBotNumero, setWaBotNumero] = useState("");
  const [waSalvando, setWaSalvando] = useState(false);
  const [waErro, setWaErro] = useState("");
  // Estado das acoes de privacidade (LGPD art. 18): exportar, desvincular e excluir.
  const [baixando, setBaixando] = useState(false);
  const [desvinculando, setDesvinculando] = useState(false);
  const [excluirAberto, setExcluirAberto] = useState(false);

  useEffect(() => {
    consultarWhatsapp()
      .then((dados) => {
        setWaTelefone(dados.telefone || "");
        setWaVinculado(Boolean(dados.vinculado));
        setWaBotNumero(dados.botNumero || "");
      })
      .catch(() => {});
  }, []);

  function trocarIdioma(event) {
    const idioma = event.target.value;
    i18n.changeLanguage(idioma);
    localStorage.setItem("language", idioma);
  }

  function salvarWhatsapp(event) {
    event.preventDefault();
    setWaErro("");
    const telefone = waTelefone.trim();
    if (!telefone) {
      setWaErro(t("profile.whatsappPhoneError"));
      return;
    }
    setWaSalvando(true);
    vincularWhatsapp(telefone)
      .then((dados) => {
        setWaVinculado(true);
        setWaTelefone(dados.telefone || telefone);
        setWaBotNumero(dados.botNumero || waBotNumero);
        pushToast(dados.mensagem || t("profile.whatsappLinked"));
      })
      .catch((error) => {
        setWaErro(error.message);
        pushToast(t("profile.whatsappError"), "error");
      })
      .finally(() => setWaSalvando(false));
  }

  /**
   * Acesso e portabilidade (LGPD art. 18, II e V).
   * O arquivo e montado no proprio navegador: os dados saem da API e vao direto
   * para o disco do titular, sem passar por servico de terceiro.
   */
  function baixarDados() {
    setBaixando(true);
    exportarMeusDados()
      .then((dados) => {
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "finanly-meus-dados-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        pushToast(t("profile.privacyDownloadDone"));
      })
      .catch((error) =>
        pushToast(error && error.message ? error.message : t("profile.privacyDownloadError"), "danger"),
      )
      .finally(() => setBaixando(false));
  }

  /** Revogacao do vinculo de WhatsApp (art. 18, IX): o bot para de responder. */
  function removerVinculo() {
    setDesvinculando(true);
    desvincularWhatsapp()
      .then(() => {
        setWaVinculado(false);
        setWaTelefone("");
        pushToast(t("profile.privacyUnlinkDone"));
      })
      .catch(() => pushToast(t("profile.privacyUnlinkError"), "danger"))
      .finally(() => setDesvinculando(false));
  }

  /** Eliminacao da conta (art. 18, VI). O modal ja confirmou senha e palavra. */
  function excluirMinhaConta(senha) {
    return excluirConta(senha).then(() => {
      pushToast(t("profile.privacyDeleteDone"));
      sair(); // encerra a sessao local: a conta nao existe mais na API
    });
  }

  return (
    <div className="profile-page">
      <header className="page-head">
        <div>
          <span className="page-kicker">{t("profile.kicker")}</span>
          <h1 className="page-title">{t("profile.title")}</h1>
          <p className="page-subtitle">{t("profile.subtitle")}</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={voltar}>
          {t("profile.back")}
        </button>
      </header>

      <section className="profile-hero">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <div className="profile-identity">
          <span className="profile-label">{t("profile.user")}</span>
          <h2 className="profile-name">{nome || email}</h2>
          <p className="profile-account">{email}</p>
        </div>
      </section>

      <div className="profile-grid">
        <section className="card card--pad-lg profile-card">
          <div className="profile-card-head">
            <span className="profile-card-icon">
              <FaUser />
            </span>
            <h3 className="card-title">{t("profile.preferences")}</h3>
          </div>
          <p className="profile-card-text">{t("profile.currency")}</p>
          <p className="profile-card-text">{t("profile.notifications")}</p>
          <label className="profile-field" htmlFor="language">
            <span>{t("profile.language")}</span>
            <select id="language" value={i18n.language} onChange={trocarIdioma}>
              <option value="pt-BR">{t("profile.portuguese")}</option>
              <option value="en-US">{t("profile.english")}</option>
            </select>
            <small>{t("profile.languageDescription")}</small>
          </label>
        </section>

        <section className="card card--pad-lg profile-card">
          <div className="profile-card-head">
            <span className="profile-card-icon profile-card-icon--whatsapp">
              <FaWhatsapp />
            </span>
            <h3 className="card-title">{t("profile.whatsappTitle")}</h3>
            {waVinculado ? (
              <span className="whatsapp-badge">{t("profile.whatsappLinkedBadge")}</span>
            ) : null}
          </div>
          <p className="profile-card-text">{t("profile.whatsappDescription")}</p>
          <p className="profile-example">{t("profile.whatsappExample")}</p>
          <p className="profile-card-text">{t("profile.whatsappCommands")}</p>
          <form className="whatsapp-form" onSubmit={salvarWhatsapp}>
            <label className="profile-field" htmlFor="whatsapp-phone">
              <span>{t("profile.whatsappPhoneLabel")}</span>
              <input
                id="whatsapp-phone"
                type="tel"
                required
                placeholder={t("profile.whatsappPhonePlaceholder")}
                value={waTelefone}
                onChange={(event) => setWaTelefone(event.target.value)}
              />
            </label>
            <button type="submit" className="btn btn--primary" disabled={waSalvando}>
              {waSalvando
                ? t("profile.whatsappSaving")
                : waVinculado
                  ? t("profile.whatsappUpdate")
                  : t("profile.whatsappSave")}
            </button>
          </form>
          {waErro ? <p className="form-error">{waErro}</p> : null}
          {waVinculado && waBotNumero ? (
            <button
              type="button"
              className="btn btn--ghost whatsapp-open-btn"
              onClick={() => abrirChatWhatsapp(waBotNumero)}
            >
              <FaWhatsapp /> {t("profile.whatsappOpen")}
            </button>
          ) : (
            <p className="profile-hint">{t("profile.whatsappHint")}</p>
          )}
        </section>
      </div>

      <section className="card card--pad-lg profile-card profile-privacy">
        <div className="profile-card-head">
          <span className="profile-card-icon">
            <FaShieldHalved />
          </span>
          <h3 className="card-title">{t("profile.privacyTitle")}</h3>
        </div>

        <p className="profile-card-text">{t("profile.privacyDescription")}</p>
        <p className="profile-hint">
          {t("profile.privacyVersion", { version: LEGAL_VERSION, updatedAt: LEGAL_UPDATED_AT })}
        </p>

        <div className="profile-privacy-docs">
          <span className="profile-label">{t("profile.privacyDocs")}</span>
          <LegalLinks onOpen={onOpenLegal} />
        </div>

        <div className="profile-privacy-actions">
          <button type="button" className="btn btn--ghost" onClick={baixarDados} disabled={baixando}>
            <FaDownload /> {baixando ? t("profile.privacyDownloading") : t("profile.privacyDownload")}
          </button>
          {waVinculado ? (
            <button type="button" className="btn btn--ghost" onClick={removerVinculo} disabled={desvinculando}>
              <FaWhatsapp /> {t("profile.privacyUnlink")}
            </button>
          ) : null}
          <button type="button" className="btn btn--danger" onClick={() => setExcluirAberto(true)}>
            <FaTrash /> {t("profile.privacyDelete")}
          </button>
        </div>

        <p className="profile-hint">{t("profile.privacyDownloadHint")}</p>
        <p className="profile-hint">{t("profile.privacyDeleteHint")}</p>
      </section>

      {excluirAberto ? (
        <DeleteAccountModal
          onClose={() => setExcluirAberto(false)}
          onConfirm={excluirMinhaConta}
        />
      ) : null}

      <button className="btn btn--danger profile-logout" type="button" onClick={sair}>
        <FaRightFromBracket /> {t("profile.logout")}
      </button>
    </div>
  );
}

export default Profile;