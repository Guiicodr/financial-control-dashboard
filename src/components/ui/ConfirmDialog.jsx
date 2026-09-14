import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/ui/toast.css";

/** Confirmacao acessivel (Esc fecha, foco no botao de confirmar). */
function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="dialog-title">{title}</p>
        {description ? <p className="dialog-text">{description}</p> : null}
        <div className="dialog-actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm} autoFocus>
            {confirmLabel || t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

