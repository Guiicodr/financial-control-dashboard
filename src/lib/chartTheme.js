/**
 * Cores de grafico por tema. Espelham os tokens de tokens.css para que os
 * charts (recharts) fiquem corretos tanto no dark quanto no light.
 */

const CHART_TOKENS = {
  dark: {
    grid: "rgba(255, 255, 255, .06)",
    axis: "#8A94A3",
    tooltipBg: "#1A1E25",
    tooltipBorder: "#2B323C",
    text: "#F4F6F8",
    muted: "#98A1AF",
    accent: "#03FC73",
    accentSoft: "rgba(3, 252, 115, .18)",
    income: "#34D399",
    expense: "#F26D6D",
    investment: "#E8B44A",
    reserve: "#F472B6",
  },
  light: {
    grid: "rgba(20, 22, 26, .08)",
    axis: "#7A808B",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#E7E3DB",
    text: "#14161A",
    muted: "#5B6270",
    /* No tema claro o accent dos graficos e o `--accent-ink` do tokens.css: a
       linha e os pontos sao desenhados sobre o card branco, onde o verde claro
       daria 1,4:1 e praticamente sumiria. */
    accent: "#007A3D",
    accentSoft: "rgba(0, 122, 61, .14)",
    income: "#0E9F6E",
    expense: "#DC4C4C",
    investment: "#C98A12",
    reserve: "#D6459B",
  },
};

export function chartTokens(theme) {
  return theme === "light" ? CHART_TOKENS.light : CHART_TOKENS.dark;
}

export default chartTokens;

