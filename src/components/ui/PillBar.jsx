import "../../styles/ui/pill-bar.css";

/**
 * Barra em pilula das telas publicas (inicio e login).
 * Slots: brand (esquerda), children (centro) e actions (direita).
 * wide: a pilula ocupa a largura da coluna (login, com as opcoes centralizadas);
 * sem ele a pilula abraca o conteudo (tela inicial).
 */
function PillBar({ brand, actions, wide = false, className = "", children }) {
  const classes = ["pill-bar-inner"];

  if (wide) classes.push("pill-bar-inner--wide");
  if (className) classes.push(className);

  return (
    <header className="pill-bar">
      <div className={classes.join(" ")}>
        {brand}
        {children}
        {actions ? <div className="pill-bar-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export default PillBar;