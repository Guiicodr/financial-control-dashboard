import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../lib/format";
import "../../styles/pages/goals.css";

/**
 * Aporte/resgate com valor informado pelo usuario. O servidor soma ao
 * valorAtual (APORTE) ou subtrai com piso em zero (RESGATE); aqui validamos
 * para nao deixar o usuario resgatar mais do que a meta possui hoje.
 */
function MovementModal({ open, objetivo, tipo, onClose, onSubmit }) {
  const { t, i18n } = useTranslation();
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !objetivo) return null;

  const atual = Number(objetivo.valorAtual || 0);
  const parsed = Number(String(valor).replace(",", "."));
  const valido = Number.isFinite(parsed) && parsed > 0;
  const resgate = tipo === "RESGATE";
  const excede = resgate && valido && parsed > atual;
  const resultante = resgate ? Math.max(0, atual - (valido ? parsed : 0)) : atual + (valido ? parsed : 0);
  const titulo = resgate ? t("goals.withdrawTitle") : t("goals.depositTitle");

  function submit(event) {
    event.preventDefault();
    if (!valido) {
      setError(t("goals.amountError"));
      return;
    }
    if (excede) {
      setError(t("goals.withdrawError", { value: formatCurrency(atual, i18n.language) }));
      return;
    }
    setError("");
    setSaving(true);
    Promise.resolve(onSubmit(objetivo.id, { valor: parsed, tipo: tipo }))
      .then(() => {
        setValor("");
        onClose();
      })
      .catch((err) =>
        setError(err && err.message ? err.message : t("goals.movementError")),
      )
      .finally(() => setSaving(false));
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog dialog--form"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-head">
          <div>
            <span className="card-kicker">{titulo}</span>
            <p className="card-subtitle">{objetivo.nome}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>

        <form className="tx-form" onSubmit={submit} noValidate>
          <p className="field-hint">{t("goals.movementHint")}</p>

          <label className="field">
            <span>{t("goals.amount")}</span>
            <input
              inputMode="decimal"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              placeholder="0,00"
              autoFocus
            />
            {excede ? <em className="field-error">{t("goals.withdrawError", { value: formatCurrency(atual, i18n.language) })}</em> : null}
            {error ? <em className="field-error">{error}</em> : null}
          </label>

          <dl className="movement-preview">
            <div>
              <dt>{t("goals.current")}</dt>
              <dd>{formatCurrency(atual, i18n.language)}</dd>
            </div>
            <div>
              <dt>{t("goals.resulting")}</dt>
              <dd>{formatCurrency(valido && !excede ? resultante : atual, i18n.language)}</dd>
            </div>
          </dl>

          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving || excede}>
              {saving ? t("common.saving") : titulo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovementModal;

