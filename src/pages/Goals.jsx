import "../styles/pages/Goals.css";
import { useTranslation } from "react-i18next";

function Goals({
  objetivos,
  nomeObjetivo,
  setNomeObjetivo,
  valorAlvo,
  setValorAlvo,
  valorAtual,
  setValorAtual,
  prazo,
  setPrazo,
  tipoObjetivo,
  setTipoObjetivo,
  adicionarObjetivo,
  deletarObjetivo,
  calcularProgressoObjetivo,
  registrarMovimentoMeta
}) {
  const { t, i18n } = useTranslation();
  return (
    <>
      <section className="form-card">
        <h2>{t("goals.newTitle")}</h2>

        <form onSubmit={adicionarObjetivo}>
          <input
            type="text"
            placeholder={t("goals.name")}
            value={nomeObjetivo}
            onChange={(e) => setNomeObjetivo(e.target.value)}
          />

          <input
            type="number"
            placeholder={t("goals.target")}
            value={valorAlvo}
            onChange={(e) => setValorAlvo(e.target.value)}
          />

          <input
            type="number"
            placeholder={t("goals.current")}
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
          />

          <input
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />

          <select
            value={tipoObjetivo}
            onChange={(e) => setTipoObjetivo(e.target.value)}
          >
            <option value="COMPRA">{t("goals.purchase")}</option><option value="ECONOMIA">{t("goals.savings")}</option><option value="INVESTIMENTO">{t("goals.investment")}</option><option value="RESERVA">{t("goals.reserve")}</option>
          </select>

          <button type="submit">{t("goals.add")}</button>
        </form>
      </section>

      <section className="transactions-card">
        <h2>{t("goals.title")}</h2>

        <ul>
          {objetivos.map((objetivo) => (
            <li key={objetivo.id}>
              <div>
                <strong>{objetivo.nome}</strong>
                <span>
                  {objetivo.tipo} • {t("goals.deadline", { date: objetivo.prazo })}
                </span>
              </div>

              <p>
                {new Intl.NumberFormat(i18n.language, { style: "currency", currency: "BRL" }).format(objetivo.valorAtual)} / {new Intl.NumberFormat(i18n.language, { style: "currency", currency: "BRL" }).format(objetivo.valorAlvo)}
              </p>

              <span>
                {t("goals.complete", { percent: calcularProgressoObjetivo(objetivo.valorAtual, objetivo.valorAlvo).toFixed(1) })}
              </span>

              <small className="goal-simulation">
                {objetivo.prazo && new Date(objetivo.prazo) > new Date()
                  ? t("goals.saveMonthly", { amount: new Intl.NumberFormat(i18n.language, { style: "currency", currency: "BRL" }).format((Math.max(0, Number(objetivo.valorAlvo) - Number(objetivo.valorAtual))) / Math.max(1, Math.ceil((new Date(objetivo.prazo) - new Date()) / (1000 * 60 * 60 * 24 * 30)))), date: new Date(objetivo.prazo).toLocaleDateString(i18n.language) })
                  : t("goals.expired")}
              </small>

              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min(calcularProgressoObjetivo(
                      objetivo.valorAtual,
                      objetivo.valorAlvo
                    ), 100)}%`
                  }}
                ></div>
              </div>

              <button
                className="delete-button"
                onClick={() => deletarObjetivo(objetivo.id)}
              >
                {t("goals.delete")}
              </button>
              <div className="goal-movement-actions">
                <button type="button" onClick={() => registrarMovimentoMeta(objetivo.id, { valor: 100, tipo: "APORTE" })}>{t("goals.deposit")}</button><button type="button" onClick={() => registrarMovimentoMeta(objetivo.id, { valor: 100, tipo: "RESGATE" })}>{t("goals.withdraw")}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Goals
