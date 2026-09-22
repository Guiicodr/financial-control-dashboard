import { flushSync } from "react-dom";

/**
 * Troca de tela da area publica com a View Transitions API.
 *
 * O problema que isto resolve: a troca de inicio -> acesso acontecia no mesmo
 * frame, e a tela nova aparecia de uma vez (principalmente na build, onde o
 * trabalho de layout/paint e maior). Com a API disponivel, o navegador tira um
 * retrato da tela antiga e faz o cross-fade para a nova, entao a troca fica
 * continua mesmo que o frame seguinte demore para ficar pronto.
 *
 * O `flushSync` e obrigatorio: o retrato da tela nova so sai depois do React
 * commitar a atualizacao, e o callback da startViewTransition e sincrono.
 *
 * Sem a API (navegador antigo) ou com preferencia por movimento reduzido, a
 * troca acontece direto e quem cobre a entrada e a animacao .view-enter do CSS.
 */
export function trocarTela(atualizar) {
  if (temViewTransition() && !prefereMovimentoReduzido()) {
    return document.startViewTransition(() => flushSync(atualizar));
  }

  atualizar();
  return null;
}

/** O navegador tem a View Transitions API? */
function temViewTransition() {
  return typeof document !== "undefined" && typeof document.startViewTransition === "function";
}

/** O sistema pediu para reduzir animacoes? */
function prefereMovimentoReduzido() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Marca no <html> que o navegador tem a View Transitions API.
 *
 * Serve para o CSS: as duas animacoes de troca de tela sao alternativas, nunca
 * simultaneas. Com a API o cross-fade e a animacao (a tela nova e capturada no
 * frame seguinte, entao uma entrada vinda de opacity 0 estragaria o retrato) e,
 * sem ela, quem cobre a troca e a animacao .view-enter do CSS.
 *
 * Roda na carga do modulo, antes do primeiro paint das telas publicas.
 */
if (temViewTransition() && !prefereMovimentoReduzido()) {
  document.documentElement.dataset.viewTransition = "on";
}

export default trocarTela;
