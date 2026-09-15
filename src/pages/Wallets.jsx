import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import WalletSummary from "../components/wallets/WalletSummary";
import CreditCardTile from "../components/wallets/CreditCardTile";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { criarCartao, deletarCartao, listarCartoes } from "../services/api";
import { pushToast } from "../lib/toast";
import { GOAL_TYPES, goalsTotalByType } from "../lib/finance";
import "../styles/pages/wallets.css";

const EMPTY_CARD = { nome: "", limite: "", diaFechamento: "", diaVencimento: "" };

/**
 * Carteiras: composicao real do patrimonio + cartoes de credito (entidade real
 * da API). O Finanly nao se conecta a bancos.
 */
function Wallets({ saldo, objetivos }) {
  const { t } = useTranslation();
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [alvo, setAlvo] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarCartoes()
      .then((data) => {
        if (ativo) {
          setCartoes(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (ativo) {
          setCartoes([]);
          setLoading(false);
        }
      });
    return () => {
      ativo = false;
    };
  }, []);

  const composition = {
    available: Number(saldo || 0),
    invested: goalsTotalByType(objetivos, GOAL_TYPES.INVESTIMENTO),
    reserve: goalsTotalByType(objetivos, GOAL_TYPES.RESERVA),
  };

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  function validate() {
    const next = {};
    if (!form.nome || form.nome.trim().length < 2) next.nome = t("wallets.errors.name");
    const limite = Number(String(form.limite).replace(",", "."));
    if (!Number.isFinite(limite) || limite <= 0) next.limite = t("wallets.errors.limit");
    const validDay = (value) => Number(value) >= 1 && Number(value) <= 31;
    if (!validDay(form.diaFechamento)) next.diaFechamento = t("wallets.errors.day");
    if (!validDay(form.diaVencimento)) next.diaVencimento = t("wallets.errors.day");
    setErrors(next);
    return Object.keys(next).length === 0 ? limite : null;
  }

  function salvar(event) {
    event.preventDefault();
    const limite = validate();
    if (limite === null) return;

    setSaving(true);
    criarCartao({
      nome: form.nome.trim(),
      limite: limite,
      diaFechamento: Number(form.diaFechamento),
      diaVencimento: Number(form.diaVencimento),
    })
      .then((novo) => {
        setCartoes((current) => current.concat([novo]));
        setForm(EMPTY_CARD);
        setShowForm(false);
        pushToast(t("wallets.saved"));
      })
      .catch((error) => pushToast(error && error.message ? error.message : t("wallets.errors.name"), "danger"))
      .finally(() => setSaving(false));
  }

  function confirmarExclusao() {
    if (!alvo) return;
    deletarCartao(alvo.id)
      .then(() => {
        setCartoes((current) => current.filter((item) => item.id !== alvo.id));
        pushToast(t("wallets.deleted"), "warning");
      })
      .catch((error) => pushToast(error && error.message ? error.message : t("wallets.errors.name"), "danger"))
      .finally(() => setAlvo(null));
  }

  return (
    <div className="wallets-page">
      <header className="page-head">
        <div>
          <span className="dashboard-kicker">{t("wallets.kicker")}</span>
          <h1 className="page-title">{t("wallets.title")}</h1>
          <p className="dashboard-subtitle">{t("wallets.subtitle")}</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setShowForm((current) => !current)}>
          <FaPlus /> {t("wallets.newCard")}
        </button>
      </header>

      <WalletSummary composition={composition} />

      <p className="wallet-notice">{t("wallets.noBankNotice")}</p>

      {showForm ? (
        <section className="wallet-card wallet-card--form">
          <div className="card-head">
            <span className="card-kicker">{t("wallets.newCard")}</span>
          </div>
          <form className="wallet-form" onSubmit={salvar} noValidate>
            <label className="field">
              <span>{t("wallets.name")}</span>
              <input value={form.nome} onChange={(event) => update("nome", event.target.value)} placeholder={t("wallets.namePlaceholder")} autoFocus />
              {errors.nome ? <em className="field-error">{errors.nome}</em> : null}
            </label>
            <div className="field-row">
              <label className="field">
                <span>{t("wallets.limit")}</span>
                <input inputMode="decimal" value={form.limite} onChange={(event) => update("limite", event.target.value)} placeholder="0,00" />
                {errors.limite ? <em className="field-error">{errors.limite}</em> : null}
              </label>
              <label className="field">
                <span>{t("wallets.closingDay")}</span>
                <input type="number" min="1" max="31" value={form.diaFechamento} onChange={(event) => update("diaFechamento", event.target.value)} placeholder="1-31" />
                {errors.diaFechamento ? <em className="field-error">{errors.diaFechamento}</em> : null}
              </label>
              <label className="field">
                <span>{t("wallets.dueDay")}</span>
                <input type="number" min="1" max="31" value={form.diaVencimento} onChange={(event) => update("diaVencimento", event.target.value)} placeholder="1-31" />
                {errors.diaVencimento ? <em className="field-error">{errors.diaVencimento}</em> : null}
              </label>
            </div>
            <div className="dialog-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)} disabled={saving}>
                {t("common.cancel")}
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? t("common.saving") : t("wallets.save")}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="wallet-card">
        <div className="card-head">
          <div>
            <span className="card-kicker">{t("wallets.cards")}</span>
            <p className="card-subtitle">{t("wallets.cardsHint")}</p>
          </div>
        </div>
        {loading ? (
          <div className="cc-grid">
            <Skeleton height={144} />
            <Skeleton height={144} />
          </div>
        ) : cartoes.length === 0 ? (
          <EmptyState title={t("wallets.noCards")} description={t("wallets.noCardsHint")} />
        ) : (
          <div className="cc-grid">
            {cartoes.map((cartao) => (
              <CreditCardTile key={cartao.id} cartao={cartao} onDelete={setAlvo} />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(alvo)}
        title={t("wallets.deleteTitle")}
        description={alvo ? t("wallets.deleteText", { name: alvo.nome }) : ""}
        onConfirm={confirmarExclusao}
        onCancel={() => setAlvo(null)}
      />
    </div>
  );
}

export default Wallets;

