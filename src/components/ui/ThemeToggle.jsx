import { FaMoon, FaSun } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import "../../styles/ui/theme-toggle.css";

function ThemeToggle({ theme = "dark", onToggle, compact = false }) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const label = isDark ? t("common.themeLight") : t("common.themeDark");

  return (
    <button
      type="button"
      className={"theme-toggle" + (compact ? " is-compact" : "")}
      onClick={onToggle}
      aria-label={label}
      title={label}
      aria-pressed={!isDark}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">{isDark ? <FaMoon /> : <FaSun />}</span>
      </span>
      {!compact && (
        <span className="theme-toggle-label">{isDark ? t("common.dark") : t("common.light")}</span>
      )}
    </button>
  );
}

export default ThemeToggle;