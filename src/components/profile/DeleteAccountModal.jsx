import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/ui/toast.css";
import "../../styles/pages/legal.css";

/**
 * Confirmacao da exclusao da conta (LGPD art. 18, VI).
 *
 * Duas travas de proposito: a senha (prova de que e o titular, e nao alguem que
 * pegou o navegador aberto) e a digitacao da palavra de confirmacao (evita o
 * clique por engano, ja que a acao e irreversivel).
 *
 * O componente e montado apenas quando o modal esta aberto (ver Profile): assim
 * o estado nasce limpo a cada abertura, sem precisar de efeito para resetar.
 */
function DeleteAccountModal({ onClose, onConfirm }) {
  const { t } = useTranslation();
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const palavra = t("profile.privacyDeleteConfirmWord");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const podeConfirmar = senha.length >= 6 && confirmacao.trim().toUpperCase() === palavra.toUpperCase();

  function confirmar(event) {
    event.preventDefault();
    setErro("");
    setExcluindo(true);
    Promise.resolve(onConfirm(senha))
      .catch((error) => {
        setErro(error && error.message ? error.message : t("profile.privacyDeleteError"));
        setExcluindo(false);
      });
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t("profile.privacyDeleteTitle")}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="dialog-title">{t("profile.privacyDeleteTitle")}</p>
        <p className="dialog-text">{t("profile.privacyDeleteText")}</p>

        <form className="tx-form" onSubmit={confirmar} noValidate>
          <label className="field">
            <span>{t("profile.privacyDeletePassword")}</span>
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder={t("profile.privacyDeletePasswordPlaceholder")}
              autoComplete="current-password"
              autoFocus
            />
          </label>

          <label className="field">
            <span>{t("profile.privacyDeleteConfirmLabel", { word: palavra })}</span>
            <input
              value={confirmacao}
              onChange={(event) => setConfirmacao(event.target.value)}
              placeholder={palavra}
              autoComplete="off"
            />
          </label>

          {erro ? <p className="form-error" role="alert">{erro}</p> : null}

          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={excluindo}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn--danger" disabled={excluindo || !podeConfirmar}>
              {excluindo ? t("profile.privacyDeleting") : t("profile.privacyDeleteConfirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
