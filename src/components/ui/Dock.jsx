/**
 * Dock (React Bits) - faixa de itens com magnificacao conforme a distancia do
 * mouse. Fonte: reactbits.dev - mantida o mais proxima possivel do original; as
 * poucas adaptacoes estao marcadas com "ADAPTACAO" para facilitar futuras
 * atualizacoes.
 */
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";

// ADAPTACAO: CSS do projeto mora em src/styles (mesma convencao de ui/Aurora.jsx).
import "../../styles/ui/dock.css";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  ariaCurrent,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      // ADAPTACAO: aria-current (pagina ativa) entra pelo item; o aria-haspopup
      // do original sai porque o rotulo do dock e um tooltip, nao um popup.
      aria-current={ariaCurrent}
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered, placement = "top" } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          // ADAPTACAO: em barra presa no topo da janela o rotulo abre abaixo do
          // item (acima ele sairia pelo limite superior da tela).
          animate={{ opacity: 1, y: placement === "bottom" ? 6 : -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label dock-label--${placement} ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
  labelPlacement = "top",
  ariaLabel = "Application dock",
  // ADAPTACAO: dentro de uma barra de navegacao o wrapper nao pode ganhar
  // altura no hover (empurraria o conteudo); com expandHeight falso a altura
  // fica presa ao painel. O default segue o comportamento do original.
  expandHeight = true,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, expandHeight ? maxHeight : panelHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: "none" }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label={ariaLabel}
      >
        {items.map((item, index) => (
          // ADAPTACAO: usa o id do item como key quando ele existir (a lista de
          // navegacao tem id estavel).
          <DockItem
            key={item.id ?? index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
            ariaCurrent={item.ariaCurrent}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel placement={labelPlacement}>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}