/**
 * Paleta do fundo animado (Aurora) da tela de login por tema. Espelha os tokens
 * de tokens.css, ja que o shader (WebGL/ogl) recebe hex e nao le CSS.
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
  speed: 0.4,
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