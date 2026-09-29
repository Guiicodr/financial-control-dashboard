import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowUp, FaTrophy } from "react-icons/fa6";
import { tituloDoNivel } from "../../lib/gamification";
import "../../styles/ui/gamification.css";

/**
 * Comemoracao de XP — o unico lugar do app que celebra pontos.
 *
 * Recebe o DELTA calculado comparando o perfil anterior com o novo (ver App.jsx). Por
 * isso o modal nunca inventa: se apareceu "+40 XP", foi porque o servidor creditou 40.
 * Subiu de nivel junto? A tela diz, com o titulo novo.
 *
 * A animacao e CSS puro (keyframes em gamification.css): nao vale trazer uma lib de
 * animacao para um selo que aparece por 3 segundos.
 */
function RewardModal({ recompensa, onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!recompensa) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recompensa, onClose]);

  if (!recompensa) return null;

  const subiuDeNivel = Number(recompensa.nivel) > Number(recompensa.nivelAnterior);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog reward-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t("gamification.reward.title")}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="reward-burst" aria-hidden="true">+{recompensa.xp}</span>
        <p className="reward-kicker">{t("gamification.reward.title")}</p>
        <p className="reward-xp">{t("gamification.reward.xp", { xp: recompensa.xp })}</p>

        {subiuDeNivel ? (
          <p className="reward-level">
            <FaArrowUp aria-hidden="true" />{" "}
            {t("gamification.reward.levelUp", {
              level: recompensa.nivel,
              title: tituloDoNivel(recompensa, t),
            })}
          </p>
        ) : (
          <p className="reward-hint">
            <FaTrophy aria-hidden="true" /> {t("gamification.reward.keepGoing")}
          </p>
        )}

        <div className="dialog-actions">
          <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>
            {t("gamification.reward.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RewardModal;
