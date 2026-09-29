import { useTranslation } from "react-i18next";
import { FaCheck, FaLock, FaLocationDot } from "react-icons/fa6";
import { tomDaEtapa } from "../../lib/gamification";
import { formatDate } from "../../lib/format";
import "../../styles/ui/gamification.css";

/** Icone por status: cumprida, atual (onde o usuario esta) ou bloqueada. */
function iconeDaEtapa(status) {
  if (status === "CONCLUIDA") return <FaCheck />;
  if (status === "ATUAL") return <FaLocationDot />;
  return <FaLock />;
}

/**
 * Jornada de evolucao: um caminho, nao uma lista de cobrancas.
 *
 * O servidor devolve a trilha completa com status e progresso; a tela so desenha. A
 * etapa ATUAL e a unica acionavel hoje — as seguintes aparecem bloqueadas de
 * proposito, porque o XP delas so e pago na ordem (ver MissaoService/JornadaService no
 * backend). Mostrar o progresso medido das bloqueadas ("1 de 3 categorias") da a
 * direcao sem prometer recompensa antes da hora.
 */
function JourneyTimeline({ jornada, total }) {
  const { t, i18n } = useTranslation();
  const etapas = (jornada && jornada.etapas) || [];

  return (
    <ol className="journey-timeline">
      {etapas.map((etapa) => (
        <li key={etapa.codigo} className={"journey-step journey-step--" + tomDaEtapa(etapa)}>
          <span className="journey-marker" aria-hidden="true">{iconeDaEtapa(etapa.status)}</span>

          <div className="journey-body">
            <div className="journey-head">
              <h3 className="journey-title">{t("gamification.journey." + etapa.codigo)}</h3>
              <span className="journey-xp">
                {etapa.status === "CONCLUIDA"
                  ? t("gamification.journey.done")
                  : t("gamification.journey.worth", { xp: etapa.xpRecompensa })}
              </span>
            </div>

            <p className="journey-hint">{t("gamification.journey." + etapa.codigo + "Hint")}</p>

            {etapa.status === "CONCLUIDA" && etapa.concluidaEm ? (
              <p className="journey-date">
                {t("gamification.journey.completedAt", { date: formatDate(etapa.concluidaEm, i18n.language) })}
              </p>
            ) : (
              <div className="journey-progress">
                <div
                  className="journey-track"
                  role="progressbar"
                  aria-valuenow={etapa.progresso}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t("gamification.journey.progressAria", {
                    step: t("gamification.journey." + etapa.codigo),
                    percent: etapa.progresso,
                  })}
                >
                  <span className="journey-track-value" style={{ width: etapa.progresso + "%" }} />
                </div>
                <span className="journey-percent">
                  {t("gamification.journey.percent", { percent: etapa.progresso })}
                </span>
              </div>
            )}
          </div>
        </li>
      ))}

      {total ? (
        <li className="journey-foot">
          {t("gamification.journey.summary", { done: jornada.concluidas, total: total })}
        </li>
      ) : null}
    </ol>
  );
}

export default JourneyTimeline;
