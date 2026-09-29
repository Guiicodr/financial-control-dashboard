import { useTranslation } from "react-i18next";
import { faltamParaProximoNivel, progressoDoNivel } from "../../lib/gamification";
import { formatNumber } from "../../lib/format";
import "../../styles/ui/gamification.css";

/**
 * Barra de XP dentro do nivel atual.
 *
 * O percentual e os numeros vem prontos do servidor (`percentualNivel`, `xpNoNivel`,
 * `xpParaProximoNivel`): o app nao conhece a curva. Se a curva mudar no backend, a
 * barra acompanha sem deploy do front.
 */
function XpBar({ perfil }) {
  const { t, i18n } = useTranslation();

  const percentual = progressoDoNivel(perfil);
  const xpNoNivel = Number((perfil && perfil.xpNoNivel) || 0);
  const falta = faltamParaProximoNivel(perfil);
  const noMaximo = Boolean(perfil && perfil.nivelMaximoAtingido);

  return (
    <div className="xp-bar">
      <div className="xp-bar-head">
        <span className="xp-bar-label">
          {t("gamification.xpInLevel", { xp: formatNumber(xpNoNivel, i18n.language, 0) })}
        </span>
        <span className="xp-bar-hint">
          {noMaximo
            ? t("gamification.maxLevel")
            : t("gamification.xpMissing", { xp: formatNumber(falta, i18n.language, 0) })}
        </span>
      </div>

      <div
        className="xp-bar-track"
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("gamification.xpBarAria", { percent: percentual })}
      >
        <span className="xp-bar-value" style={{ width: percentual + "%" }} />
      </div>
    </div>
  );
}

export default XpBar;
