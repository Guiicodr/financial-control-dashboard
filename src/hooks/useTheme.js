import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function readInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

/**
 * Controla o tema (dark | light) aplicando data-theme no html.
 * A preferencia fica persistida entre sessoes.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}

export default useTheme;