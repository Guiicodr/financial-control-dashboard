import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ui/ThemeToggle";
import Dock from "../ui/Dock";
import { initialsOf } from "../../lib/format";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "../../styles/app-shell.css";

// Precisa bater com o breakpoint de tablet definido em styles/app-shell.css.
const DESKTOP_MIN_WIDTH = 1081;
const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`;

/* Navegacao no topo em Dock (React Bits). A magnificacao tem o mesmo valor da
   altura do painel: o item cresce dentro da pilula, entao nao estoura a barra
   (que fica com altura fixa) nem desloca o conteudo. */
const DOCK_PANEL_HEIGHT = 44;
const DOCK_BASE_ITEM = 34;
const DOCK_MAGNIFICATION = 44;
const DOCK_DISTANCE = 140;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Casca da aplicacao: navbar no topo no desktop (>= 1081px) e menu
 * deslizante + barra inferior em telas menores.
 * O fundo animado (Aurora) fica restrito as telas iniciais (publicas): aqui o
 * fundo e chapado (--bg-main), com as barras e o conteudo por cima.
 */
function AppShell({
  navItems,
  activeId,
  onNavigate,
  user,
  onOpenProfile,
  theme,
  onToggleTheme,
  children,
  fab,
}) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // A navbar no topo so existe no desktop: em telas menores valem o menu
  // deslizante e a barra inferior.
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  // Com movimento reduzido o dock fica estatico (tamanho base = magnificado).
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const initials = initialsOf(user && (user.nome || user.email));
  const mobileItems = navItems.slice(0, 5);

  const brand = (
    <div className="shell-brand">
      <img className="shell-brand-logo" src="/logo.png" alt="" width="36" height="36" />
      <span className="shell-brand-text">
        <strong>Finanly</strong>
        <span>{t("brand.tagline")}</span>
      </span>
    </div>
  );

  const navButtons = navItems.map((item) => (
    <button
      key={item.id}
      type="button"
      className={"shell-nav-item" + (activeId === item.id ? " is-active" : "")}
      aria-current={activeId === item.id ? "page" : undefined}
      onClick={() => { setSidebarOpen(false); onNavigate(item.id); }}
    >
      {item.icon}
      <span className="shell-nav-label">{t(item.labelKey)}</span>
    </button>
  ));

  // No topo a mesma navegacao vira Dock: fica o icone e o rotulo aparece no
  // tooltip do item. A pagina atual entra pelo estado do item (is-active).
  const dockItems = navItems.map((item) => {
    const isActive = activeId === item.id;

    return {
      id: item.id,
      icon: item.icon,
      label: t(item.labelKey),
      className: isActive ? "is-active" : "",
      ariaCurrent: isActive ? "page" : undefined,
      onClick: () => {
        setSidebarOpen(false);
        onNavigate(item.id);
      },
    };
  });

  return (
    <div className="shell">
      <aside className={"shell-sidebar" + (sidebarOpen ? " is-open" : "")}>
        <div className="shell-sidebar-head">
          {isDesktop ? null : brand}
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
          {navButtons}
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
          <div className="shell-topbar-inner">
            <button
              type="button"
              className="shell-icon-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("common.menuOpen")}
            >
              <FaBars />
            </button>

            {isDesktop && (
              <>
                {brand}
                <nav className="shell-topnav" aria-label={t("common.menu")}>
                  <Dock
                    items={dockItems}
                    ariaLabel={t("common.menu")}
                    labelPlacement="bottom"
                    panelHeight={DOCK_PANEL_HEIGHT}
                    baseItemSize={DOCK_BASE_ITEM}
                    magnification={reduceMotion ? DOCK_BASE_ITEM : DOCK_MAGNIFICATION}
                    distance={DOCK_DISTANCE}
                    expandHeight={false}
                  />
                </nav>
              </>
            )}

            <div className="shell-topbar-right">
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

