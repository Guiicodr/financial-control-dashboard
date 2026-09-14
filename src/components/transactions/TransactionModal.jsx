import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EXPENSE_CATEGORIES } from "../../lib/finance";
import "../../styles/pages/transactions.css";

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function emptyForm() {
  return { tipo: "DESPESA", descricao: "", valor: "", data: todayISO(), categoria: EXPENSE_CATEGORIES[0] };
}

function formFromInitial(initial) {
  return {
    tipo: "DESPESA",
    descricao: initial.descricao || "",
    valor: initial.valor === undefined || initial.valor === null ? "" : String(initial.valor),
    data: String(initial.data || todayISO()).slice(0, 10),
    categoria: initial.categoria || EXPENSE_CATEGORIES[0],
  };
}

/**
 * Cria despesa (POST /transacoes), cria receita extra (POST /income) e edita
 * despesa existente (PUT /transacoes/{id}).
 * Investimento/Reserva sao aportes de meta e ficam na pagina Metas.
 */
function TransactionModal({ open, initial, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => (initial ? formFromInitial(initial) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const editing = Boolean(initial);
  const isExpense = form.tipo === "DESPESA";

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  function validate() {
    const next = {};
    const valor = Number(String(form.valor).replace(",", "."));
    if (!form.descricao || form.descricao.trim().length < 2) next.descricao = t("tx.errors.description");
    if (!Number.isFinite(valor) || valor <= 0) next.valor = t("tx.errors.amount");
    if (!form.data) next.data = t("tx.errors.date");
    setErrors(next);
    return Object.keys(next).length === 0 ? valor : null;
  }

  function submit(event) {
    event.preventDefault();
    setServerError("");
    const valor = validate();
    if (valor === null) return;

    setSaving(true);
    Promise.resolve(
      onSubmit({
        tipo: form.tipo,
        descricao: form.descricao.trim(),
        valor: valor,
        data: form.data,
        categoria: isExpense ? form.categoria : null,
        id: initial ? initial.id : null,
      }),
    )
      .then(() => {
        setSaving(false);
        onClose();
      })
      .catch((error) => {
        setSaving(false);
        setServerError(error && error.message ? error.message : t("tx.errors.generic"));
      });
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog dialog--form"
        role="dialog"
        aria-modal="true"
        aria-label={editing ? t("tx.editTitle") : t("tx.newTitle")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-head">
          <div>
            <span className="card-kicker">{editing ? t("tx.editTitle") : t("tx.newTitle")}</span>
            <p className="card-subtitle">{t("tx.formHint")}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>

        {!editing ? (
          <div className="segmented" role="group" aria-label={t("tx.type")}>
            {["DESPESA", "RECEITA"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                className={form.tipo === tipo ? "is-active" : ""}
                aria-pressed={form.tipo === tipo}
                onClick={() => update("tipo", tipo)}
              >
                {t("tx.type" + tipo)}
              </button>
            ))}
          </div>
        ) : null}

        <form className="tx-form" onSubmit={submit} noValidate>
          <label className="field">
            <span>{t("tx.description")}</span>
            <input
              value={form.descricao}
              onChange={(event) => update("descricao", event.target.value)}
              placeholder={t("tx.descriptionPlaceholder")}
              autoFocus
            />
            {errors.descricao ? <em className="field-error">{errors.descricao}</em> : null}
          </label>

          <div className="field-row">
            <label className="field">
              <span>{t("tx.amount")}</span>
              <input
                inputMode="decimal"
                value={form.valor}
                onChange={(event) => update("valor", event.target.value)}
                placeholder="0,00"
              />
              {errors.valor ? <em className="field-error">{errors.valor}</em> : null}
            </label>

            <label className="field">
              <span>{t("tx.date")}</span>
              <input type="date" value={form.data} onChange={(event) => update("data", event.target.value)} />
              {errors.data ? <em className="field-error">{errors.data}</em> : null}
            </label>
          </div>

          {isExpense ? (
            <label className="field">
              <span>{t("tx.category")}</span>
              <select value={form.categoria} onChange={(event) => update("categoria", event.target.value)}>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{t("categories." + category)}</option>
                ))}
              </select>
            </label>
          ) : (
            <p className="field-hint">{t("tx.incomeHint")}</p>
          )}
          <p className="field-hint">{t("tx.investmentHint")}</p>

          {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}

          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;

