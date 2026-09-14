import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBullseye, FaPlus } from "react-icons/fa6";
import { formatCurrency, formatPercent } from "../lib/format";
import { goalProgress, goalsTotalByType } from "../lib/finance";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import GoalCard from "../components/goals/GoalCard";
import GoalForm from "../components/goals/GoalForm";
import MovementModal from "../components/goals/MovementModal";
import { pushToast } from "../lib/toast";
import "../styles/pages/goals.css";

/** Total reservado por tipo de meta (derivado de Objetivo.tipo). */
function totalByType(objetivos, tipo) {
  return Number(goalsTotalByType(objetivos, tipo) || 0);
}

/**
 * Metas: cada card mostra progresso real (valorAtual/valorAlvo), status pelo
 * prazo e ritmo mensal necessario. Aporte e resgate usam valor informado pelo
 * usuario (POST /metas/movimentos/{id}).
 */
function Goals({ objetivos, adicionarObjetivo, deletarObjetivo, registrarMovimentoMeta }) {
  const { t, i18n } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [movimento, setMovimento] = useState({ open: false, objetivo: null, tipo: "APORTE" });
  const [confirmar, setConfirmar] = useState(null);

  const lista = objetivos || [];
  const totalAlvo = lista.reduce((soma, item) => soma + Number(item.valorAlvo || 0), 0);
  const totalAtual = lista.reduce((soma, item) => soma + Number(item.valorAtual || 0), 0);
  const concluidas = lista.filter((item) => goalProgress(item) >= 100).length;
  const geral = totalAlvo > 0 ? Math.min((totalAtual / totalAlvo) * 100, 100) : 0;

  function abrirMovimento(objetivo, tipo) {
    setMovimento({ open: true, objetivo, tipo });
  }

  function fecharMovimento() {
    setMovimento({ open: false, objetivo: null, tipo: "APORTE" });
  }

  function criar(dados) {
    return Promise.resolve(adicionarObjetivo(dados)).then(() =>
      pushToast(t("goals.toastCreated", { name: dados.nome })),
    );
  }

  function remover() {
    const alvo = confirmar;
    if (!alvo) return;
    Promise.resolve(deletarObjetivo(alvo.id))
      .then(() => pushToast(t("goals.toastDeleted")))
      .catch(() => pushToast(t("goals.errors.generic"), "error"))
      .finally(() => setConfirmar(null));
  }

  function salvarMovimento(id, movimentoDados) {
    return Promise.resolve(registrarMovimentoMeta(id, movimentoDados)).then(() =>
      pushToast(
        t(movimentoDados.tipo === "RESGATE" ? "goals.toastWithdraw" : "goals.toastDeposit", {
          amount: formatCurrency(movimentoDados.valor, i18n.language),
        }),
      ),
    );
  }

  return (
    <div className="goals-page">
      <header className="page-head">
        <div>
          <span className="page-kicker">{t("goals.kicker")}</span>
          <h1 className="page-title">{t("goals.title")}</h1>
          <p className="page-subtitle">{t("goals.subtitle")}</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setFormOpen((aberto) => !aberto)}
        >
          <FaPlus /> {t("goals.new")}
        </button>
      </header>

      <section className="goals-summary">
        <div className="goals-chip">
          <span>{t("goals.summaryTarget")}</span>
          <strong>{formatCurrency(totalAlvo, i18n.language)}</strong>
        </div>
        <div className="goals-chip">
          <span>{t("goals.summaryCurrent")}</span>
          <strong>{formatCurrency(totalAtual, i18n.language)}</strong>
        </div>
        <div className="goals-chip">
          <span>{t("goals.summaryProgress")}</span>
          <strong>{formatPercent(geral, i18n.language, 0)}</strong>
        </div>
        <div className="goals-chip">
          <span>{t("goals.summaryDone")}</span>
          <strong>{concluidas} / {lista.length}</strong>
        </div>
        <div className="goals-chip">
          <span>{t("goals.summaryInvested")}</span>
          <strong>{formatCurrency(totalByType(lista, "INVESTIMENTO"), i18n.language)}</strong>
        </div>
        <div className="goals-chip">
          <span>{t("goals.summaryReserve")}</span>
          <strong>{formatCurrency(totalByType(lista, "RESERVA"), i18n.language)}</strong>
        </div>
      </section>

      {formOpen ? (
        <section className="goals-form-card">
          <GoalForm onCreate={criar} onCancel={() => setFormOpen(false)} />
        </section>
      ) : null}

      {lista.length === 0 ? (
        <EmptyState
          icon={<FaBullseye />}
          title={t("goals.empty")}
          description={t("goals.emptyHint")}
          action={<button type="button" className="btn btn--primary" onClick={() => setFormOpen(true)}>{t("goals.new")}</button>}
        />
      ) : (
        <section className="goals-grid">
          {lista.map((objetivo) => (
            <GoalCard
              key={objetivo.id}
              objetivo={objetivo}
              onDeposit={(item) => abrirMovimento(item, "APORTE")}
              onWithdraw={(item) => abrirMovimento(item, "RESGATE")}
              onDelete={setConfirmar}
            />
          ))}
        </section>
      )}

      <MovementModal
        open={movimento.open}
        objetivo={movimento.objetivo}
        tipo={movimento.tipo}
        onClose={fecharMovimento}
        onSubmit={salvarMovimento}
      />

      <ConfirmDialog
        open={Boolean(confirmar)}
        title={t("goals.deleteTitle")}
        description={confirmar ? t("goals.deleteText", { name: confirmar.nome }) : ""}
        confirmLabel={t("goals.delete")}
        onConfirm={remover}
        onCancel={() => setConfirmar(null)}
      />
    </div>
  );
}

export default Goals;

