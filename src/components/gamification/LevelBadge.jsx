import { useTranslation } from "react-i18next";
import { faltamParaProximoNivel, nivelDe, progressoDoNivel, tituloDoNivel } from "../../lib/gamification";
import { formatNumber } from "../../lib/format";
import "../../styles/ui/gamification.css";

/**
 * Selo de nivel: anel de progresso + titulo + XP.
 *
 * O anel e desenhado a partir do percentual que o SERVIDOR ja calculou
 * (`percentualNivel`): o front nao conhece a curva de XP, so desenha. Assim, calibrar
 * os niveis no backend reflete aqui sem deploy coordenado.
 */
const TAMANHO = 132;
const ESPESSURA = 10;
const RAIO = (TAMANHO - ESPESSURA) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function LevelBadge({ perfil, compacto = false }) {
  const { t, i18n } = useTranslation();

  const percentual = progressoDoNivel(perfil);
  const nivel = nivelDe(perfil);
  const falta = faltamParaProximoNivel(perfil);
  const xpTotal = Number((perfil && perfil.xpTotal) || 0);
  const ofensiva = Number((perfil && perfil.ofensivaSemanas) || 0);

  if (compacto) {
    return (
      <span className="level-compact" title={tituloDoNivel(perfil, t)}>
        <span className="level-compact-number">{t("gamification.levelShort", { level: nivel })}</span>
      </span>
    );
  }

  return (
    <div className="level-badge">
      <div className="level-ring-wrap">
        <svg
          className="level-ring"
          width={TAMANHO}
          height={TAMANHO}
          viewBox={"0 0 " + TAMANHO + " " + TAMANHO}
          role="img"
          aria-label={t("gamification.levelAria", { level: nivel, percent: percentual })}
        >
          <circle
            className="level-ring-track"
            cx={TAMANHO / 2}
            cy={TAMANHO / 2}
            r={RAIO}
            strokeWidth={ESPESSURA}
            fill="none"
          />
          <circle
            className="level-ring-value"
            cx={TAMANHO / 2}
            cy={TAMANHO / 2}
            r={RAIO}
            strokeWidth={ESPESSURA}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={CIRCUNFERENCIA * (1 - percentual / 100)}
            transform={"rotate(-90 " + TAMANHO / 2 + " " + TAMANHO / 2 + ")"}
          />
        </svg>

        <div className="level-center">
          <span className="level-number">{nivel}</span>
          <span className="level-label">{t("gamification.levelLabel")}</span>
        </div>
      </div>

      <div className="level-meta">
        <p className="level-title">{tituloDoNivel(perfil, t)}</p>
        <p className="level-xp">
          {t("gamification.xpTotal", { xp: formatNumber(xpTotal, i18n.language, 0) })}
        </p>
        <p className="level-next">
          {perfil && perfil.nivelMaximoAtingido
            ? t("gamification.maxLevel")
            : t("gamification.xpToNext", { xp: formatNumber(falta, i18n.language, 0) })}
        </p>
        {ofensiva > 0 ? (
          <p className="level-streak">{t("gamification.streak", { count: ofensiva })}</p>
        ) : null}
      </div>
    </div>
  );
}

export default LevelBadge;
