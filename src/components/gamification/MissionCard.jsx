import { useTranslation } from "react-i18next";
import {
  chaveDoStatusDaMissao,
  percentualSeguro,
  semPrazo,
  tomDaMissao,
} from "../../lib/gamification";
import { formatCurrency } from "../../lib/format";
import "../../styles/ui/gamification.css";

/**
 * Missao do mes ou meta de longo prazo, na mesma forma.
 *
 * O cartao nao decide nada: tom, percentual, ritmo, dias restantes e recompensa vem
 * calculados pelo servidor. Isso e proposital — a regra de "esta no ritmo?" envolve
 * dias do mes e trajetoria linear, e ter uma segunda versao disso em JS seria criar
 * duas verdades sobre o mesmo fato.
 */
function MissionCard({ missao }) {
  const { t, i18n } = useTranslation();

  const tom = tomDaMissao(missao);
  const percentual = percentualSeguro(missao.percentual);
  const deMeta = missao.tipo === "META";
  const titulo = deMeta
    ? missao.nome || t("gamification.missions.metaFallback")
    : t("categories." + missao.categoria);

  return (
    <article className={"mission-card mission-card--" + tom}>
      <div className="mission-head">
        <div>
          <span className="mission-kind">
            {deMeta ? t("gamification.missions.kindMeta") : t("gamification.missions.kindCategory")}
          </span>
          <h3 className="mission-title">{titulo}</h3>
        </div>
        <span className={"mission-status mission-status--" + tom}>
          {t(chaveDoStatusDaMissao(missao))}
        </span>
      </div>

      <div className="mission-values">
        <strong>{formatCurrency(missao.progressoValor || 0, i18n.language)}</strong>
        <span>{t("gamification.missions.goalOf", { target: formatCurrency(missao.metaValor || 0, i18n.language) })}</span>
      </div>

      <div
        className="mission-track"
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("gamification.missions.progressAria", { percent: percentual })}
      >
        <span className="mission-track-value" style={{ width: Math.min(percentual, 100) + "%" }} />
      </div>

      <div className="mission-foot">
        <span className="mission-percent">{t("gamification.missions.percent", { percent: percentual })}</span>

        {deMeta ? null : (
          <span className={missao.noRitmo ? "mission-flag is-ok" : "mission-flag is-warn"}>
            {missao.noRitmo ? t("gamification.missions.onTrack") : t("gamification.missions.offTrack")}
          </span>
        )}

        {semPrazo(missao) ? null : (
          <span className="mission-days">
            {t("gamification.missions.daysLeft", { count: Number(missao.diasRestantes) })}
          </span>
        )}

        {Number(missao.xpRecompensa) > 0 ? (
          <span className="mission-xp">
            {deMeta
              ? t("gamification.missions.nextMilestone", { xp: missao.xpRecompensa })
              : t("gamification.missions.reward", { xp: missao.xpRecompensa })}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default MissionCard;
