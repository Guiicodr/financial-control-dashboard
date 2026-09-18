/**
 * Paleta do fundo animado (Aurora) das telas iniciais por tema. Espelha os
 * tokens de tokens.css, ja que o shader (WebGL/ogl) recebe hex e nao le CSS.
 */

const AURORA_TOKENS = {
  dark: {
    stops: ["#7C5CFF", "#4338CA", "#22D3EE"],
    lightMode: false,
  },
  light: {
    stops: ["#6D4AFF", "#A78BFA", "#7DD3FC"],
    lightMode: true,
  },
};

/** Ajustes comuns aos dois temas, calibrados para fundo de tela cheia. */
export const AURORA_TUNING = {
  /* Velocidade do shader: uTime = segundos * speed, e o ruido avanca
     0.25 * speed por segundo no eixo vertical. Em 0.4 uma "onda" completa
     levava ~10s (fundo quase parado); em 0.8 leva ~5s. */
  speed: 0.8,
  blend: 0.39,
  amplitude: 1.0,
};

export function auroraProps(theme) {
  const tokens = theme === "light" ? AURORA_TOKENS.light : AURORA_TOKENS.dark;
  return {
    colorStops: tokens.stops,
    lightMode: tokens.lightMode,
    ...AURORA_TUNING,
  };
}

export default auroraProps;