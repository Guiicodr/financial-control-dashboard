import "../../styles/ui/pill-bar.css";

/**
 * Marca Finanly (logo + nome) usada nas barras em pilula.
 * Com onClick vira um botao (ex.: voltar para a tela inicial).
 */
function PillBarBrand({ onClick, label }) {
  const conteudo = (
    <>
      <span className="pill-bar-logo" aria-hidden="true">F</span>
      <span className="pill-bar-name">Finanly.</span>
    </>
  );

  if (!onClick) {
    return <div className="pill-bar-brand">{conteudo}</div>;
  }

  return (
    <button type="button" className="pill-bar-brand" onClick={onClick} aria-label={label} title={label}>
      {conteudo}
    </button>
  );
}

export default PillBarBrand;