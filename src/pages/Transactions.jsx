import {
  FaTrash,
  FaBurger,
  FaCar,
  FaGamepad,
  FaBook,
  FaBox,
  FaFileImport,
  FaXmark,
  FaCheck,
} from "react-icons/fa6";
import { useMemo, useRef, useState } from "react";

import "../styles/pages/Transactions.css";

const categoryIcons = {
  ALIMENTACAO: <FaBurger />,
  TRANSPORTE: <FaCar />,
  LAZER: <FaGamepad />,
  ESTUDOS: <FaBook />,
  OUTROS: <FaBox />,
};

const categoryLabels = {
  ALIMENTACAO: "Food",
  TRANSPORTE: "Transport",
  LAZER: "Leisure",
  ESTUDOS: "Education",
  OUTROS: "Others",
};

function Transactions({
  descricao,
  setDescricao,
  valor,
  setValor,
  categoria,
  setCategoria,
  categoriasFormulario,
  transacoes,
  adicionarTransacoes,
  deletarTransacao,
  importarTransacoes,
  analisarExtrato,
}) {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
  const [periodo, setPeriodo] = useState(() => new Date().toISOString().slice(0, 7));
  const [modalAberto, setModalAberto] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [previsao, setPrevisao] = useState([]);
  const [arquivoNome, setArquivoNome] = useState("");
  const [importando, setImportando] = useState(false);
  const arquivoInput = useRef(null);

  const transacoesFiltradas = useMemo(() => transacoes
    .filter((transacao) => transacao.tipo === "SAIDA")
    .filter((transacao) => filtroCategoria === "TODAS" || transacao.categoria === filtroCategoria)
    .filter((transacao) => !periodo || String(transacao.data).startsWith(periodo))
    .filter((transacao) => `${transacao.descricao} ${transacao.categoria}`.toLowerCase().includes(busca.toLowerCase())),
    [transacoes, filtroCategoria, periodo, busca]);

  function lerArquivo(arquivo) {
    if (!arquivo) return;
    setArquivoNome(arquivo.name);
    analisarExtrato(arquivo).then((transacoes) => setPrevisao(transacoes.map((transacao) => ({ ...transacao, selecionada: true })))).catch(() => setPrevisao([]));
  }

  function confirmarImportacao() {
    const selecionadas = previsao.filter((transacao) => transacao.selecionada).map((transacao) => ({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      data: transacao.data,
      categoria: transacao.categoria,
    }));
    setImportando(true);
    importarTransacoes(selecionadas).then(() => {
      setImportando(false);
      setModalAberto(false);
      setPrevisao([]);
      setArquivoNome("");
    });
  }

  function exportarCsv() {
    const linhas = [["Descrição", "Valor", "Categoria", "Data"], ...transacoesFiltradas.map(item => [item.descricao, item.valor, item.categoria, item.data])];
    const csv = linhas.map(linha => linha.map(celula => `"${String(celula).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
    link.download = "transacoes-filtradas.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="transactions-page">

      <div className="page-header">
        <h1>Transactions</h1>
        <p>Manage your expenses.</p>
        <button className="import-button" type="button" onClick={() => setModalAberto(true)}>
          <FaFileImport /> Import OFX/CSV
        </button>
      </div>

      <div className="transactions-form-card">

        <form
          className="transactions-form"
          onSubmit={adicionarTransacoes}
        >

          <input
            type="text"
            placeholder="Description"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasFormulario
              .filter((cat) => cat.value !== "SALARIO")
              .map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                >
                  {cat.label}
                </option>
              ))}
          </select>

          <button
            className="add-btn"
            type="submit"
          >
            Add Transaction
          </button>

        </form>

      </div>

      <div className="transactions-toolbar">

        <input
          className="transactions-search"
          placeholder="Search by description or category..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />

        <select className="transactions-filter" value={filtroCategoria} onChange={(event) => setFiltroCategoria(event.target.value)}>
          <option value="TODAS">All Categories</option>

          {categoriasFormulario
            .filter(cat => cat.value !== "SALARIO")
            .map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
        </select>
        <input className="transactions-period" type="month" value={periodo} onChange={(event) => setPeriodo(event.target.value)} aria-label="Filter by month" />
        <button className="export-button" type="button" onClick={exportarCsv}>CSV</button>
        <button className="export-button" type="button" onClick={() => window.print()}>PDF</button>

      </div>

      <div className="transactions-list">

        {transacoesFiltradas.length === 0 ? (

          <div className="transactions-empty">
            No transactions registered.
          </div>

        ) : (

          transacoesFiltradas
            .map((t) => (

              <div
                className="transaction-card"
                key={t.id}
              >

                <div className="transaction-left">

                  <div className="transaction-icon expense">
                    {categoryIcons[t.categoria]}
                  </div>

                  <div className="transaction-info">

                    <h3>{t.descricao}</h3>

                    <p>
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>

                    <span>
                      {categoryIcons[t.categoria]}{" "}
                      {categoryLabels[t.categoria]}
                    </span>

                  </div>

                </div>

                <div className="transaction-right">

                  <strong className="transaction-value">
                    - R${" "}
                    {Number(t.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>

                  <button
                    onClick={() => deletarTransacao(t.id)}
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            ))

        )}

      </div>

      {modalAberto && (
        <div className="import-modal-backdrop" role="presentation" onClick={() => setModalAberto(false)}>
          <section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title" onClick={(event) => event.stopPropagation()}>
            <div className="import-modal-header"><div><span className="eyebrow">Import center</span><h2 id="import-title">Import statement</h2></div><button className="modal-close" type="button" onClick={() => setModalAberto(false)} aria-label="Close"><FaXmark /></button></div>
            {previsao.length === 0 ? (
              <button className={`drop-zone ${arrastando ? "dragging" : ""}`} type="button" onClick={() => arquivoInput.current?.click()} onDragOver={(event) => { event.preventDefault(); setArrastando(true); }} onDragLeave={() => setArrastando(false)} onDrop={(event) => { event.preventDefault(); setArrastando(false); lerArquivo(event.dataTransfer.files[0]); }}>
                <FaFileImport /><strong>Drop your OFX or CSV here</strong><span>or click to browse · expenses with negative amounts are detected</span><input ref={arquivoInput} type="file" accept=".ofx,.csv,text/csv,application/x-ofx" hidden onChange={(event) => lerArquivo(event.target.files[0])} />
              </button>
            ) : (
              <><div className="preview-meta"><strong>{arquivoNome}</strong><span>{previsao.filter((item) => item.selecionada).length} of {previsao.length} selected</span></div><div className="import-preview-list">{previsao.map((item, index) => <label className="import-preview-row" key={`${item.data}-${index}`}><input type="checkbox" checked={item.selecionada} onChange={() => setPrevisao((atual) => atual.map((transacao, itemIndex) => itemIndex === index ? { ...transacao, selecionada: !transacao.selecionada } : transacao))} /><span><strong>{item.descricao}</strong><small>{new Date(item.data).toLocaleDateString("pt-BR")} · Others</small></span><b>- R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b></label>)}</div><div className="import-modal-actions"><button className="secondary-button" type="button" onClick={() => setPrevisao([])}>Choose another</button><button className="primary-button" type="button" disabled={!previsao.some((item) => item.selecionada) || importando} onClick={confirmarImportacao}><FaCheck /> {importando ? "Saving..." : "Confirm transactions"}</button></div></>
            )}
          </section>
        </div>
      )}

    </div>
  );
}

export default Transactions;