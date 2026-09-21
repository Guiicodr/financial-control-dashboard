import "../../styles/ui/pill-bar.css";

/**
 * Marca Finanly (nome) usada nas barras em pilula. A logo em icone entra por
 * padrao; nameOnly mostra so o nome (barra da tela inicial).
 * Com onClick vira um botao (ex.: voltar para a tela inicial).
 */
function PillBarBrand({ onClick, label, nameOnly = false }) {
  const conteudo = (
    <>
      {nameOnly ? null : <img className="pill-bar-logo" src="/logo.png" alt="" width="30" height="30" />}
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