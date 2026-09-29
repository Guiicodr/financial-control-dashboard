import { useTranslation } from "react-i18next";
import { FaLock, FaTrophy } from "react-icons/fa6";
import "../../styles/ui/gamification.css";

/**
 * Colecao de conquistas.
 *
 * O catalogo inteiro vem do servidor, com o status de cada badge — inclusive os que
 * o titular ainda nao tem, exibidos como silhueta. Mostrar o que falta e o que faz a
 * colecao ter sentido: um trofeu que voce nem sabe que existe nao motiva ninguem.
 */
function AchievementGrid({ conquistas = [] }) {
  const { t } = useTranslation();

  return (
    <ul className="achievement-grid">
      {conquistas.map((conquista) => (
        <li
          key={conquista.codigo}
          className={"achievement" + (conquista.desbloqueada ? " is-unlocked" : " is-locked")}
        >
          <span className="achievement-icon" aria-hidden="true">
            {conquista.desbloqueada ? <FaTrophy /> : <FaLock />}
          </span>

          <div className="achievement-text">
            <span className="achievement-name">{t("gamification.achievements." + conquista.codigo)}</span>
            <span className="achievement-hint">
              {t("gamification.achievements." + conquista.codigo + "Hint")}
            </span>
          </div>

          <span className="achievement-xp">
            {conquista.desbloqueada
              ? t("gamification.achievements.earned", { xp: conquista.xpDeBonus })
              : t("gamification.achievements.worth", { xp: conquista.xpDeBonus })}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default AchievementGrid;
