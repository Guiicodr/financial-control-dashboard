/**
 * Finanly - derivacoes do Modo Consciente.
 *
 * REGRA CRITICA (a mesma de lib/finance.js): nada aqui inventa dado. Nivel, curva,
 * XP, catalogo de conquistas e etapas da jornada vem PRONTOS do servidor — o front
 * nao recalcula regra de gamificacao. O que mora neste arquivo e:
 *
 *   1. apresentacao (tom, percentual seguro, formatacao);
 *   2. traducao dos codigos do servidor para o i18n;
 *   3. a decisao de qual texto de dica usar (i18n do app ou o do servidor).
 *
 * Essa separacao e o que impede a classe de bug mais cara do projeto: duas versoes
 * da mesma regra (uma em JS, outra em Java) que divergem com o tempo.
 */

/** Percentual seguro: nunca NaN, nunca fora de 0-100. */
export function percentualSeguro(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 0;
  return Math.max(0, Math.min(100, Math.round(numero)));
}

/** Nivel atual do perfil (1 quando ainda nao ha perfil). */
export function nivelDe(perfil) {
  return perfil && Number.isFinite(Number(perfil.nivel)) ? Number(perfil.nivel) : 1;
}

/** Titulo traduzido do nivel (o servidor manda o codigo). */
export function tituloDoNivel(perfil, t) {
  const codigo = (perfil && perfil.tituloNivel) || "OBSERVADOR";
  return t("gamification.levels." + codigo);
}

/** Progresso do nivel em percentual (o servidor ja manda calculado; aqui so saneia). */
export function progressoDoNivel(perfil) {
  return percentualSeguro(perfil && perfil.percentualNivel);
}

/** Quanto falta para o proximo nivel (0 no nivel maximo). */
export function faltamParaProximoNivel(perfil) {
  const falta = Number(perfil && perfil.xpParaProximoNivel);
  return Number.isFinite(falta) ? Math.max(0, falta) : 0;
}

/* ------------------------------- Missoes ------------------------------- */

/**
 * Tom visual da missao, alinhado aos tons que o app ja usa (positive/warning/danger).
 *
 * Missao cumprida e sempre positiva, falha e sempre critica; enquanto ativa, o tom
 * segue o ritmo — estourou o limite e critico, fora do ritmo e atencao, no ritmo e
 * positivo. Meta de longo prazo nao tem ritmo mensal, entao fica neutra.
 */
export function tomDaMissao(missao) {
  if (!missao) return "neutral";
  if (missao.status === "CUMPRIDA") return "positive";
  if (missao.status === "FALHOU") return "danger";
  if (missao.tipo === "META") return "neutral";
  if (Number(missao.percentual) >= 100) return "danger";
  return missao.noRitmo ? "positive" : "warning";
}

/** Texto do status da missao (chave do i18n). */
export function chaveDoStatusDaMissao(missao) {
  const status = (missao && missao.status) || "ATIVA";
  return "gamification.missions.status" + status;
}

/** A missao esta travada por nao haver progresso possivel? (meta sem prazo) */
export function semPrazo(missao) {
  return !missao || missao.diasRestantes === null || missao.diasRestantes === undefined;
}

/* -------------------------------- Jornada -------------------------------- */

/** Tom visual da etapa da jornada. */
export function tomDaEtapa(etapa) {
  if (!etapa) return "neutral";
  if (etapa.status === "CONCLUIDA") return "positive";
  if (etapa.status === "ATUAL") return "accent";
  return "muted";
}

/* --------------------------------- Dicas --------------------------------- */

/**
 * Texto final da dica.
 *
 * Quando o servidor gerou a frase (mensagemGerada = true) ela e exibida como veio: o
 * valor esta na redacao. Caso contrario, o app monta a frase no proprio i18n, usando
 * os PARAMETROS do fato — assim a mentoria fala o idioma do usuario mesmo que o
 * template do servidor esteja em pt-BR.
 */
export function textoDaDica(t, dica) {
  if (!dica) return "";
  if (dica.mensagemGerada && dica.mensagem) return dica.mensagem;

  const parametros = parametrosTraduzidos(t, dica);
  const chave = "gamification.mentor." + dica.codigo;
  const texto = t(chave, parametros);

  // Codigo sem traducao no i18n: melhor mostrara frase do servidor do que a chave crua.
  return texto === chave ? dica.mensagem || "" : texto;
}

/** Traduz os parametros que sao codigos (categoria, tipo de revisao). */
function parametrosTraduzidos(t, dica) {
  const parametros = { ...(dica.parametros || {}) };

  if (parametros.categoria) parametros.categoria = t("categories." + parametros.categoria);
  if (parametros.tipo === "SEMANAL") parametros.tipo = t("gamification.mentor.revisaoSemanal");
  if (parametros.tipo === "MENSAL") parametros.tipo = t("gamification.mentor.revisaoMensal");

  return parametros;
}

/** Rotulo da acao sugerida pela dica (leva para a tela certa). */
export function rotuloDaAcao(t, acao) {
  const chave = "gamification.actions." + (acao || "dashboard");
  const texto = t(chave);
  return texto === chave ? t("gamification.actions.dashboard") : texto;
}

/** Icone por tom (mantem a leitura do painel de insights). */
export function tomDaDica(dica) {
  return (dica && dica.tom) || "neutral";
}
