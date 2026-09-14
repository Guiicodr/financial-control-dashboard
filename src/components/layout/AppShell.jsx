import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";
import { initialsOf } from "../../lib/format";
import "../../styles/app-shell.css";

function AppShell({
  navItems,
  activeId,
  onNavigate,
  user,
  onOpenProfile,
  theme,
  onToggleTheme,
  syncLabel,
  children,
  fab,
}) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = initialsOf(user && (user.nome || user.email));
  const mobileItems = navItems.slice(0, 5);

  return (
    <div className="shell">
      <aside className={"shell-sidebar" + (sidebarOpen ? " is-open" : "")}>
        <div className="shell-sidebar-head">
          <div className="shell-brand">
            <span className="shell-brand-logo" aria-hidden="true">F</span>
            <span className="shell-brand-text">
              <strong>Finanly</strong>
              <span>{t("brand.tagline")}</span>
            </span>
          </div>
          <button
            type="button"
            className="shell-icon-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("common.menuClose")}
          >
            <FaXmark />
          </button>
        </div>

        <nav className="shell-nav" aria-label={t("common.menu")}>
          <span className="shell-nav-caption">{t("common.menu")}</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={"shell-nav-item" + (activeId === item.id ? " is-active" : "")}
              aria-current={activeId === item.id ? "page" : undefined}
              onClick={() => { setSidebarOpen(false); onNavigate(item.id); }}
            >
              {item.icon}
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        <div className="shell-sidebar-footer">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="shell-user" onClick={onOpenProfile}>
            <span className="shell-avatar" aria-hidden="true">{initials}</span>
            <span className="shell-user-info">
              <strong>{user && (user.nome || user.email)}</strong>
              <span>{t("nav.profile")}</span>
            </span>
          </button>
        </div>
      </aside>

      <div
        className={"shell-overlay" + (sidebarOpen ? " is-open" : "")}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="shell-main">
        <header className="shell-topbar">
          <button
            type="button"
            className="shell-icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("common.menuOpen")}
          >
            <FaBars />
          </button>

          <div className="shell-topbar-right">
            {syncLabel && (
              <span className="shell-sync">
                <span className="shell-sync-dot" aria-hidden="true" />
                {syncLabel}
              </span>
            )}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
            <button
              type="button"
              className="shell-avatar-top"
              onClick={onOpenProfile}
              aria-label={t("nav.profile")}
            >
              {initials}
            </button>
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>

      <nav className="shell-mobile-nav" aria-label={t("common.menu")}>
        {mobileItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeId === item.id ? "is-active" : ""}
            aria-current={activeId === item.id ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>

      {fab}
    </div>
  );
}

export default AppShell;

