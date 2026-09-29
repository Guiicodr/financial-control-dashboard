import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/ui/gamification.css";

const SITUACOES = {
  PONTUADA: "gamification.review.PONTUADA",
  JA_REVISADA: "gamification.review.JA_REVISADA",
  SEM_PENDENCIA: "gamification.review.SEM_PENDENCIA",
};

/**
 * Check-in semanal/mensal.
 *
 * O modal nao decide se a revisao vale XP: quem decide e o servidor, e ele responde
 * com a situacao (PONTUADA | JA_REVISADA | SEM_PENDENCIA). Isso evita o pior tipo de
 * frustracao — o app prometer "+40 XP" e nao pagar (ou pagar duas vezes).
 *
 * O XP ganho NAO aparece aqui: a comemoracao acontece no RewardModal, disparado quando
 * o perfil e recarregado e o total de XP sobe. Assim existe um unico lugar no app que
 * celebra XP, e ele sempre mostra o valor real do servidor.
 */
function ReviewModal({ open, pendencias, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [enviando, setEnviando] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const semanalPendente = Boolean(pendencias && pendencias.revisaoSemanalPendente);
  const mensalPendente = Boolean(pendencias && pendencias.revisaoMensalPendente);
  const competencia = pendencias
    ? {
        SEMANAL: pendencias.competenciaSemanal,
        MENSAL: pendencias.competenciaMensal,
      }
    : {};

  function enviar(tipo) {
    setErro("");
    setEnviando(tipo);
    Promise.resolve(onSubmit(tipo))
      .then((resposta) => setResultado(resposta))
      .catch((error) => setErro((error && error.message) || t("gamification.review.error")))
      .finally(() => setEnviando(null));
  }

  function fechar() {
    setResultado(null);
    setErro("");
    onClose();
  }

  return (
    <div className="dialog-backdrop" onClick={fechar}>
      <div
        className="dialog dialog--form"
        role="dialog"
        aria-modal="true"
        aria-label={t("gamification.review.title")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-head">
          <div>
            <span className="card-kicker">{t("gamification.review.kicker")}</span>
            <p className="card-subtitle">
              {resultado ? t("gamification.review.resultHint") : t("gamification.review.hint")}
            </p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={fechar}>
            {t("common.close")}
          </button>
        </div>

        {resultado ? (
          <div className="review-result">
            <p className="review-situation">{t(SITUACOES[resultado.situacao] || SITUACOES.SEM_PENDENCIA)}</p>
            {resultado.competencia ? (
              <p className="review-competencia">
                {t("gamification.review.competencia", { competencia: resultado.competencia })}
              </p>
            ) : null}
            <div className="dialog-actions">
              <button type="button" className="btn btn--primary" onClick={fechar} autoFocus>
                {t("gamification.review.finish")}
              </button>
            </div>
          </div>
        ) : (
          <div className="review-options">
            {["SEMANAL", "MENSAL"].map((tipo) => {
              const pendente = tipo === "SEMANAL" ? semanalPendente : mensalPendente;
              return (
                <div key={tipo} className={"review-option" + (pendente ? "" : " is-done")}>
                  <div className="review-option-text">
                    <strong>{t("gamification.review." + tipo)}</strong>
                    <span className="review-option-hint">
                      {pendente
                        ? t("gamification.review.pending")
                        : t("gamification.review.upToDate")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={"btn " + (pendente ? "btn--primary" : "btn--ghost")}
                    disabled={Boolean(enviando)}
                    onClick={() => enviar(tipo)}
                  >
                    {enviando === tipo ? t("common.saving") : t("gamification.review.checkin")}
                  </button>

                  {competencia[tipo] ? (
                    <span className="review-option-competencia">{competencia[tipo]}</span>
                  ) : null}
                </div>
              );
            })}

            {erro ? <p className="form-error" role="alert">{erro}</p> : null}

            <p className="field-hint">{t("gamification.review.whenItCounts")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;
