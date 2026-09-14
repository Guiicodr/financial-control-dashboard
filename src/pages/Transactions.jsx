import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaReceipt } from "react-icons/fa6";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Skeleton from "../components/ui/Skeleton";
import { formatCurrency } from "../lib/format";
import "../styles/pages/transactions.css";

const EMPTY_FILTERS = { busca: "", tipo: "TODAS", categoria: "TODAS", mes: "TODOS", ordem: "dateDesc" };

function monthOf(value) {
  return value ? String(value).slice(0, 7) : "";
}

/**
 * Transacoes = despesas (POST /transacoes) + receitas extras (Income EXTRA).
 * A renda BASE e recorrente (configuracao), por isso nao entra como lancamento.
 */
function Transactions({ transacoes, rendas, loading, onNew, onEdit, onDelete }) {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [alvo, setAlvo] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  const lancamentos = useMemo(() => {
    const despesas = (transacoes || []).map((item) => ({
      chave: "D-" + item.id,
      origem: "DESPESA",
      id: item.id,
      descricao: item.descricao,
      categoria: item.categoria,
      data: String(item.data || "").slice(0, 10),
      valor: Number(item.valor || 0),
    }));
    const receitas = (rendas || [])
      .filter((item) => item.tipo === "EXTRA")
      .map((item) => ({
        chave: "R-" + item.id,
        origem: "RECEITA",
        id: item.id,
        descricao: item.descricao,
        categoria: null,
        data: String(item.data || "").slice(0, 10),
        valor: Number(item.valor || 0),
      }));
    return despesas.concat(receitas);
  }, [transacoes, rendas]);

  const meses = useMemo(() => {
    const set = new Set(lancamentos.map((item) => monthOf(item.data)).filter(Boolean));
    return Array.from(set).sort().reverse();
  }, [lancamentos]);

  const filtrados = useMemo(() => {
    const termo = filters.busca.trim().toLowerCase();
    const lista = lancamentos.filter((item) => {
      if (filters.tipo !== "TODAS" && item.origem !== filters.tipo) return false;
      if (filters.categoria !== "TODAS" && item.categoria !== filters.categoria) return false;
      if (filters.mes !== "TODOS" && monthOf(item.data) !== filters.mes) return false;
      if (termo) {
        const alvo = (item.descricao + " " + (item.categoria || "")).toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });

    const ordenada = lista.slice();
    if (filters.ordem === "dateAsc") ordenada.sort((a, b) => a.data.localeCompare(b.data));
    else if (filters.ordem === "valueDesc") ordenada.sort((a, b) => b.valor - a.valor);
    else if (filters.ordem === "valueAsc") ordenada.sort((a, b) => a.valor - b.valor);
    else ordenada.sort((a, b) => b.data.localeCompare(a.data));
    return ordenada;
  }, [lancamentos, filters]);

  const resumo = useMemo(() => {
    return filtrados.reduce(
      (acc, item) => {
        if (item.origem === "RECEITA") acc.entradas += item.valor;
        else acc.saidas += item.valor;
        acc.resultado = acc.entradas - acc.saidas;
        return acc;
      },
      { entradas: 0, saidas: 0, resultado: 0 },
    );
  }, [filtrados]);

  function confirmarExclusao() {
    if (!alvo) return;
    setRemovendo(true);
    Promise.resolve(onDelete(alvo))
      .then(() => setAlvo(null))
      .catch(() => setAlvo(null))
      .finally(() => setRemovendo(false));
  }

  return (
    <div className="tx-page">
      <header className="page-head">
        <div>
          <span className="dashboard-kicker">{t("transactions.title")}</span>
          <h1 className="page-title">{t("transactions.subtitle")}</h1>
        </div>
        <button type="button" className="btn btn--primary" onClick={onNew}>
          <FaPlus /> {t("tx.newTitle")}
        </button>
      </header>

      <div className="tx-summary">
        <div className="tx-summary-item">
          <span>{t("tx.inflow")}</span>
          <strong className="tx-value--income">{formatCurrency(resumo.entradas, i18n.language)}</strong>
        </div>
        <div className="tx-summary-item">
          <span>{t("tx.outflow")}</span>
          <strong className="tx-value--expense">{formatCurrency(resumo.saidas, i18n.language)}</strong>
        </div>
        <div className="tx-summary-item">
          <span>{t("tx.result")}</span>
          <strong className={resumo.resultado < 0 ? "tx-value--expense" : "tx-value--income"}>
            {formatCurrency(resumo.resultado, i18n.language)}
          </strong>
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
        months={meses}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <section className="tx-card">
        {loading ? (
          <div className="tx-skeleton">
            <Skeleton height={58} />
            <Skeleton height={58} />
            <Skeleton height={58} />
          </div>
        ) : (
          <TransactionList
            items={filtrados}
            onEdit={onEdit}
            onDelete={(item) => setAlvo(item)}
            emptyTitle={t("transactions.empty")}
            emptyText={t("tx.emptyHint")}
            emptyAction={(
              <button type="button" className="btn btn--primary" onClick={onNew}>
                <FaReceipt /> {t("tx.newTitle")}
              </button>
            )}
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(alvo)}
        title={t("tx.deleteTitle")}
        description={alvo ? t("tx.deleteText", { name: alvo.descricao }) : ""}
        confirmLabel={removendo ? t("common.removing") : t("common.delete")}
        onConfirm={confirmarExclusao}
        onCancel={() => setAlvo(null)}
      />
    </div>
  );
}

export default Transactions;

