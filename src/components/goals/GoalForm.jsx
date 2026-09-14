import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GOAL_TYPES } from "../../lib/finance";
import "../../styles/pages/goals.css";

const GOAL_TYPE_KEYS = [
  { value: GOAL_TYPES.COMPRA, key: "goals.typeCOMPRA" },
  { value: GOAL_TYPES.ECONOMIA, key: "goals.typeECONOMIA" },
  { value: GOAL_TYPES.INVESTIMENTO, key: "goals.typeINVESTIMENTO" },
  { value: GOAL_TYPES.RESERVA, key: "goals.typeRESERVA" },
];

function emptyForm() {
  return { nome: "", valorAlvo: "", valorAtual: "", prazo: "", tipo: GOAL_TYPES.COMPRA };
}

/** Criacao de meta (POST /objetivos) com validacao no cliente. */
function GoalForm({ onCreate, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  function validate() {
    const next = {};
    const alvo = Number(String(form.valorAlvo).replace(",", "."));
    const atual = form.valorAtual === "" ? 0 : Number(String(form.valorAtual).replace(",", "."));
    if (!form.nome || form.nome.trim().length < 2) next.nome = t("goals.errors.name");
    if (!Number.isFinite(alvo) || alvo <= 0) next.valorAlvo = t("goals.errors.target");
    if (!Number.isFinite(atual) || atual < 0) next.valorAtual = t("goals.errors.current");
    if (!form.prazo) next.prazo = t("goals.errors.deadline");
    setErrors(next);
    if (Object.keys(next).length > 0) return null;
    return { nome: form.nome.trim(), valorAlvo: alvo, valorAtual: atual, prazo: form.prazo, tipo: form.tipo };
  }

  function submit(event) {
    event.preventDefault();
    const payload = validate();
    if (!payload) return;
    setSaving(true);
    Promise.resolve(onCreate(payload))
      .then(() => {
        setForm(emptyForm());
        onCancel();
      })
      .catch((error) =>
        setErrors({ geral: error && error.message ? error.message : t("goals.errors.generic") }),
      )
      .finally(() => setSaving(false));
  }

  return (
    <form className="goal-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>{t("goals.name")}</span>
        <input
          value={form.nome}
          onChange={(event) => update("nome", event.target.value)}
          placeholder={t("goals.namePlaceholder")}
          autoFocus
        />
        {errors.nome ? <em className="field-error">{errors.nome}</em> : null}
      </label>

      <div className="field-row">
        <label className="field">
          <span>{t("goals.target")}</span>
          <input inputMode="decimal" value={form.valorAlvo} onChange={(event) => update("valorAlvo", event.target.value)} placeholder="0,00" />
          {errors.valorAlvo ? <em className="field-error">{errors.valorAlvo}</em> : null}
        </label>
        <label className="field">
          <span>{t("goals.current")}</span>
          <input inputMode="decimal" value={form.valorAtual} onChange={(event) => update("valorAtual", event.target.value)} placeholder="0,00" />
          {errors.valorAtual ? <em className="field-error">{errors.valorAtual}</em> : null}
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>{t("goals.deadlineLabel")}</span>
          <input type="date" value={form.prazo} onChange={(event) => update("prazo", event.target.value)} />
          {errors.prazo ? <em className="field-error">{errors.prazo}</em> : null}
        </label>
        <label className="field">
          <span>{t("goals.typeLabel")}</span>
          <select value={form.tipo} onChange={(event) => update("tipo", event.target.value)}>
            {GOAL_TYPE_KEYS.map((item) => (
              <option key={item.value} value={item.value}>{t(item.key)}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="field-hint">{t("goals.formHint")}</p>
      {errors.geral ? <p className="form-error" role="alert">{errors.geral}</p> : null}

      <div className="dialog-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? t("common.saving") : t("goals.add")}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;

