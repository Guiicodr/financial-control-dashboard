import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBriefcase, FaTrash } from "react-icons/fa6";
import { formatCurrency } from "../lib/format";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import { pushToast } from "../lib/toast";
import "../styles/pages/income.css";

/**
 * Rendas: a renda BASE representa o salario mensal e as EXTRAS registram
 * entradas pontuais. Os formularios usam valor informado pelo usuario e
 * validam valor > 0 antes de chamar a API.
 */
function Income({ rendas, carregarRendas, criarRenda, atualizarRenda, deletarRendaPorId }) {
  const { t, i18n } = useTranslation();
  const [extraDescricao, setExtraDescricao] = useState("");
  const [extraValor, setExtraValor] = useState("");
  const [erroBase, setErroBase] = useState("");
  const [erroExtra, setErroExtra] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [confirmar, setConfirmar] = useState(null);

  const lista = rendas || [];
  const rendaBase = lista.find((renda) => renda.tipo === "BASE");
  const totalBase = Number(rendaBase?.valor || 0);
  const extras = lista.filter((renda) => renda.tipo !== "BASE");
  const totalExtras = extras.reduce((soma, renda) => soma + Number(renda.valor || 0), 0);
  const total = lista.reduce((soma, renda) => soma + Number(renda.valor || 0), 0);

  function salvarBase(event) {
    event.preventDefault();
    setErroBase("");
    const form = new FormData(event.currentTarget);
    const descricao = String(form.get("descricao") || "").trim();
    const valor = Number(form.get("valor"));
    if (!descricao) {
      setErroBase(t("incomePage.errors.description"));
      return;
    }
    if (!(valor > 0)) {
      setErroBase(t("incomePage.errors.amount"));
      return;
    }
    const dados = { descricao, valor, tipo: "BASE" };
    const request = rendaBase ? atualizarRenda(rendaBase.id, dados) : criarRenda(dados);
    setSalvando(true);
    Promise.resolve(request)
      .then(() => carregarRendas())
      .then(() =>
        pushToast(t(rendaBase ? "incomePage.toastBaseUpdated" : "incomePage.toastBaseCreated")),
      )
      .catch(() => pushToast(t("incomePage.errors.generic"), "error"))
      .finally(() => setSalvando(false));
  }

  function adicionarExtra(event) {
    event.preventDefault();
    setErroExtra("");
    const descricao = extraDescricao.trim();
    const valor = Number(extraValor);
    if (!descricao) {
      setErroExtra(t("incomePage.errors.description"));
      return;
    }
    if (!(valor > 0)) {
      setErroExtra(t("incomePage.errors.amount"));
      return;
    }
    setSalvando(true);
    Promise.resolve(criarRenda({ descricao, valor, tipo: "EXTRA" }))
      .then(() => {
        setExtraDescricao("");
        setExtraValor("");
        return carregarRendas();
      })
      .then(() => pushToast(t("incomePage.toastExtraCreated", { name: descricao })))
      .catch(() => pushToast(t("incomePage.errors.generic"), "error"))
      .finally(() => setSalvando(false));
  }

  function remover() {
    const alvo = confirmar;
    if (!alvo) return;
    Promise.resolve(deletarRendaPorId(alvo.id))
      .then(() => carregarRendas())
      .then(() => pushToast(t("incomePage.toastDeleted")))
      .catch(() => pushToast(t("incomePage.errors.generic"), "error"))
      .finally(() => setConfirmar(null));
  }

  return (
    <div className="income-page">
      <header className="page-head">
        <div>
          <span className="page-kicker">{t("incomePage.kicker")}</span>
          <h1 className="page-title">{t("incomePage.title")}</h1>
          <p className="page-subtitle">{t("incomePage.subtitle")}</p>
        </div>
      </header>

      <section className="income-summary">
        <div className="income-chip">
          <span>{t("incomePage.summaryTotal")}</span>
          <strong>{formatCurrency(total, i18n.language)}</strong>
        </div>
        <div className="income-chip">
          <span>{t("incomePage.summaryBase")}</span>
          <strong>{formatCurrency(totalBase, i18n.language)}</strong>
        </div>
        <div className="income-chip">
          <span>{t("incomePage.summaryExtra")}</span>
          <strong>{formatCurrency(totalExtras, i18n.language)}</strong>
        </div>
        <div className="income-chip">
          <span>{t("incomePage.summaryCount")}</span>
          <strong>{lista.length}</strong>
        </div>
      </section>

      <section className="income-card">
        <div className="income-card-head">
          <h2 className="card-title">{t("incomePage.baseTitle")}</h2>
          <p className="card-subtitle">{t("incomePage.baseDescription")}</p>
        </div>
        <form className="income-form" key={rendaBase?.id || "nova-base"} onSubmit={salvarBase}>
          <label className="field">
            <span>{t("incomePage.baseName")}</span>
            <input
              name="descricao"
              required
              placeholder={t("incomePage.basePlaceholder")}
              defaultValue={rendaBase?.descricao || ""}
            />
          </label>
          <label className="field">
            <span>{t("incomePage.amount")}</span>
            <input
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0,00"
              defaultValue={rendaBase?.valor ?? ""}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={salvando}>
            {t(rendaBase ? "incomePage.updateBase" : "incomePage.saveBase")}
          </button>
        </form>
        {erroBase ? <p className="form-error">{erroBase}</p> : null}
      </section>

      <section className="income-card">
        <div className="income-card-head">
          <h2 className="card-title">{t("incomePage.extraTitle")}</h2>
          <p className="card-subtitle">{t("incomePage.extraDescription")}</p>
        </div>
        <form className="income-form" onSubmit={adicionarExtra}>
          <label className="field">
            <span>{t("incomePage.extraName")}</span>
            <input
              required
              placeholder={t("incomePage.extraPlaceholder")}
              value={extraDescricao}
              onChange={(event) => setExtraDescricao(event.target.value)}
            />
          </label>
          <label className="field">
            <span>{t("incomePage.amount")}</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0,00"
              value={extraValor}
              onChange={(event) => setExtraValor(event.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={salvando}>
            {t("incomePage.addExtra")}
          </button>
        </form>
        {erroExtra ? <p className="form-error">{erroExtra}</p> : null}
      </section>

      <section className="income-list-section">
        <div className="income-list-head">
          <h2 className="card-title">{t("incomePage.registered")}</h2>
          <span className="income-list-count">{lista.length}</span>
        </div>
        {lista.length === 0 ? (
          <EmptyState
            icon={<FaBriefcase />}
            title={t("incomePage.empty")}
            description={t("incomePage.emptyMessage")}
          />
        ) : (
          <div className="income-list">
            {lista.map((renda) => (
              <article className="income-item" key={renda.id}>
                <div className="income-left">
                  <div
                    className={
                      renda.tipo === "BASE" ? "income-icon" : "income-icon income-icon--extra"
                    }
                  >
                    <FaBriefcase />
                  </div>
                  <div className="income-identity">
                    <h3 className="income-name">{renda.descricao}</h3>
                    <span className="income-type">
                      {renda.tipo === "BASE" ? t("incomePage.base") : t("incomePage.extra")}
                    </span>
                  </div>
                </div>
                <div className="income-right">
                  <strong className="income-amount">
                    {formatCurrency(renda.valor, i18n.language)}
                  </strong>
                  <button
                    type="button"
                    className="income-delete"
                    aria-label={t("incomePage.delete")}
                    onClick={() => setConfirmar(renda)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(confirmar)}
        title={t("incomePage.deleteTitle")}
        description={confirmar ? t("incomePage.deleteText", { name: confirmar.descricao }) : ""}
        confirmLabel={t("incomePage.delete")}
        onConfirm={remover}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  );
}

export default Income;