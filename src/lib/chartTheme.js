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
    accent: "#7C5CFF",
    accentSoft: "rgba(124, 92, 255, .18)",
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
    accent: "#6D4AFF",
    accentSoft: "rgba(109, 74, 255, .14)",
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

