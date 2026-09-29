import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBolt, FaBullseye, FaClipboardCheck, FaTrophy } from "react-icons/fa6";
import LevelBadge from "../components/gamification/LevelBadge";
import XpBar from "../components/gamification/XpBar";
import MissionCard from "../components/gamification/MissionCard";
import MentorCard from "../components/gamification/MentorCard";
import JourneyTimeline from "../components/gamification/JourneyTimeline";
import AchievementGrid from "../components/gamification/AchievementGrid";
import ReviewModal from "../components/gamification/ReviewModal";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import {
  listarConquistas,
  listarDicasMentora,
  listarJornada,
  listarMissoes,
  registrarRevisao,
} from "../services/api";
import { percentualSeguro } from "../lib/gamification";
import "../styles/pages/jornada.css";

/**
 * Jornada — a tela do Modo Consciente.
 *
 * Quatro blocos, na ordem em que o usuario precisa deles:
 *   1. onde eu estou (nivel, XP, ofensiva) e o que fazer agora (check-in);
 *   2. o que eu prometi neste mes (missoes de contencao + metas);
 *   3. o caminho (jornada de evolucao, uma etapa por vez);
 *   4. o que eu ja conquistei (badges) — e a mentora, quando tem algo a dizer.
 *
 * Toda a regra vive no servidor: nivel, curva de XP, progresso, ritmo e criterio de
 * conquista chegam prontos. O front exibe e traduz — inclusive os codigos de missoes,
 * conquistas, etapas e dicas, que viram texto no i18n.
 *
 * A pagina carrega os proprios dados (como o Dashboard faz com alertas e
 * notificacoes); apenas o PERFIL vem de cima, porque o mesmo numero aparece no chip do
 * cabecalho do app — uma fonte so, sem dois lugares discordando do nivel.
 */
function Jornada({ perfil, onRefreshPerfil, onNavigate }) {
  const { t } = useTranslation();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [missoes, setMissoes] = useState(null);
  const [conquistas, setConquistas] = useState(null);
  const [jornada, setJornada] = useState(null);
  const [dicas, setDicas] = useState([]);
  const [revisaoAberta, setRevisaoAberta] = useState(false);

  const carregar = useCallback(() => {
    return Promise.allSettled([
      listarMissoes(),
      listarConquistas(),
      listarJornada(),
      listarDicasMentora(),
    ]).then(([rMissoes, rConquistas, rJornada, rDicas]) => {
      if (rMissoes.status === "fulfilled") setMissoes(rMissoes.value);
      if (rConquistas.status === "fulfilled") setConquistas(rConquistas.value);
      if (rJornada.status === "fulfilled") setJornada(rJornada.value);
      if (rDicas.status === "fulfilled") setDicas(rDicas.value || []);

      // Só mostra erro quando NADA carregou: perder uma das quatro seções não deve
      // esconder as outras três.
      const todasFalharam = [rMissoes, rConquistas, rJornada, rDicas].every(
        (resultado) => resultado.status === "rejected",
      );
      setErro(todasFalharam ? t("common.loadError") : "");
      setCarregando(false);
    });
  }, [t]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /**
   * Check-in: registra e recarrega TUDO.
   *
   * A revisao mexe em XP, ofensiva, etapas da jornada e badges ao mesmo tempo — por
   * isso a tela se remonta inteira em vez de atualizar um pedaco. O XP ganho e
   * comemorado pelo RewardModal, que compara o perfil antes e depois (onRefreshPerfil).
   */
  function revisar(tipo) {
    return registrarRevisao(tipo).then((resposta) =>
      Promise.all([carregar(), Promise.resolve(onRefreshPerfil && onRefreshPerfil())]).then(
        () => resposta,
      ),
    );
  }

  const listaMissoes = (missoes && missoes.missoes) || [];
  const missoesDeCategoria = listaMissoes.filter((missao) => missao.tipo === "CATEGORIA");
  const metas = listaMissoes.filter((missao) => missao.tipo === "META");
  const pendencias = perfil && perfil.revisoes;
  const revisaoPendente = Boolean(
    pendencias && (pendencias.revisaoSemanalPendente || pendencias.revisaoMensalPendente),
  );

  if (carregando) {
    return (
      <div className="jornada-page" aria-busy="true">
        <Skeleton height={168} />
        <div style={{ height: 16 }} />
        <Skeleton height={220} />
      </div>
    );
  }

  return (
    <div className="jornada-page">
      <header className="page-head">
        <div>
          <span className="page-kicker">{t("gamification.kicker")}</span>
          <h1 className="page-title">{t("gamification.title")}</h1>
          <p className="page-subtitle">{t("gamification.subtitle")}</p>
        </div>

        <button
          type="button"
          className={"btn " + (revisaoPendente ? "btn--primary" : "btn--ghost")}
          onClick={() => setRevisaoAberta(true)}
        >
          <FaClipboardCheck />{" "}
          {revisaoPendente ? t("gamification.review.openPending") : t("gamification.review.open")}
        </button>
      </header>

      {erro ? <p className="form-error" role="alert">{erro}</p> : null}

      <Card className="jornada-level-card" padding="lg">
        <LevelBadge perfil={perfil} />
        <div className="jornada-level-side">
          <XpBar perfil={perfil} />
          {pendencias ? (
            <ul className="jornada-checkins">
              <li className={pendencias.revisaoSemanalPendente ? "is-pending" : "is-done"}>
                {t("gamification.review.SEMANAL")}
                <span>
                  {pendencias.revisaoSemanalPendente
                    ? t("gamification.review.pending")
                    : t("gamification.review.upToDate")}
                </span>
              </li>
              <li className={pendencias.revisaoMensalPendente ? "is-pending" : "is-done"}>
                {t("gamification.review.MENSAL")}
                <span>
                  {pendencias.revisaoMensalPendente
                    ? t("gamification.review.pending")
                    : t("gamification.review.upToDate")}
                </span>
              </li>
            </ul>
          ) : null}
        </div>
      </Card>

      <div className="jornada-columns">
        <div className="jornada-main">
          <section className="jornada-section">
            <div className="jornada-section-head">
              <h2 className="jornada-section-title">
                <FaBullseye aria-hidden="true" /> {t("gamification.missions.title")}
              </h2>
              {missoes && missoes.xpEmJogo > 0 ? (
                <span className="jornada-section-note">
                  {t("gamification.missions.xpInPlay", { xp: missoes.xpEmJogo })}
                </span>
              ) : null}
            </div>

            {missoesDeCategoria.length === 0 ? (
              <EmptyState
                title={t("gamification.missions.empty")}
                description={t("gamification.missions.emptyHint")}
                action={
                  onNavigate ? (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => onNavigate("relatorios")}
                    >
                      {t("gamification.actions.relatorios")}
                    </button>
                  ) : null
                }
              />
            ) : (
              <div className="mission-grid">
                {missoesDeCategoria.map((missao) => (
                  <MissionCard key={missao.codigo} missao={missao} />
                ))}
              </div>
            )}
          </section>

          {metas.length > 0 ? (
            <section className="jornada-section">
              <div className="jornada-section-head">
                <h2 className="jornada-section-title">
                  <FaBolt aria-hidden="true" /> {t("gamification.missions.goalsTitle")}
                </h2>
              </div>
              <div className="mission-grid">
                {metas.map((missao) => (
                  <MissionCard key={missao.codigo} missao={missao} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="jornada-section">
            <div className="jornada-section-head">
              <h2 className="jornada-section-title">{t("gamification.journey.title")}</h2>
              {jornada ? (
                <span className="jornada-section-note">
                  {t("gamification.journey.progress", {
                    percent: percentualSeguro(jornada.progressoGeral),
                  })}
                </span>
              ) : null}
            </div>
            <JourneyTimeline jornada={jornada} total={jornada && jornada.total} />
          </section>
        </div>

        <aside className="jornada-side">
          <MentorCard dicas={dicas} onNavigate={onNavigate} />

          <Card className="achievements-card">
            <div className="card-head">
              <div>
                <span className="card-kicker">
                  <FaTrophy aria-hidden="true" /> {t("gamification.achievements.title")}
                </span>
                <p className="card-subtitle">
                  {conquistas
                    ? t("gamification.achievements.summary", {
                        done: conquistas.desbloqueadas,
                        total: conquistas.total,
                      })
                    : ""}
                </p>
              </div>
            </div>
            <AchievementGrid conquistas={conquistas ? conquistas.conquistas : []} />
          </Card>
        </aside>
      </div>

      <ReviewModal
        open={revisaoAberta}
        pendencias={pendencias}
        onClose={() => setRevisaoAberta(false)}
        onSubmit={revisar}
      />
    </div>
  );
}

export default Jornada;
