import { splitHighlights } from "../../lib/highlight";
import "../../styles/ui/blur-highlight.css";

/* Ritmo padrao: cada palavra entra em sequencia e, quando a ultima comeca, os
   destaques sao varridos da esquerda para a direita. */
const STEP = 70;
const DURATION = 800;
const SWEEP_STEP = 120;
const SWEEP_DURATION = 520;

/**
 * Paragrafo animado (Blur Highlight do React Bits, variante CSS): o texto entra
 * palavra por palavra, borrado, e depois os trechos pedidos em `highlights` sao
 * marcados por uma varredura automatica.
 *
 * ADAPTACAO: port para CSS puro + tokens do projeto, sem Tailwind/shadcn e sem
 * `motion`. O borrao e a varredura sao animacoes CSS com atraso por palavra, o
 * que deixa o ritmo todo no arquivo de estilo e faz prefers-reduced-motion
 * valer pela media query, sem estado nem observadores no componente.
 *
 * - highlights: trechos a destacar (ignora maiusculas e acentos);
 * - delay / step / duration: ritmo de entrada das palavras, em ms;
 * - sweepDelay: quando o primeiro destaque entra (padrao: inicio da ultima palavra);
 * - sweepStep / sweepDuration: ritmo da varredura dos destaques, em ms;
 * - as: tag do paragrafo (p, span, div...).
 */
function BlurHighlight({
  children,
  highlights = [],
  delay = 0,
  step = STEP,
  duration = DURATION,
  sweepDelay = null,
  sweepStep = SWEEP_STEP,
  sweepDuration = SWEEP_DURATION,
  as: Tag = "p",
  className = "",
}) {
  const classes = ["blur-highlight", className].filter(Boolean).join(" ");

  /* Conteudo que nao e texto simples (negrito, link...) passa intacto. */
  if (typeof children !== "string") {
    return <Tag className={classes}>{children}</Tag>;
  }

  const nodes = [];
  let words = 0;
  let marks = 0;

  splitHighlights(children, highlights).forEach((segment) => {
    /* O split com grupo de captura mantem os espacos na lista: eles voltam como
       texto puro (permitindo a quebra de linha normal) e separam as palavras. */
    const parts = segment.text.split(/(\s+)/).filter(Boolean).map((token) => {
      if (/^\s+$/.test(token)) return { space: token };

      const part = { text: token, index: words };
      words += 1;
      return part;
    });

    /* Trecho sem destaque: as palavras entram soltas, como antes. */
    if (segment.order === null) {
      parts.forEach((part) => {
        nodes.push(
          part.space
            ? { kind: "space", key: `space-${nodes.length}`, text: part.space }
            : { kind: "word", key: `word-${part.index}`, text: part.text, index: part.index }
        );
      });
      return;
    }

    /* Trecho destacado: uma caixa unica por frase, com os espacos internos
       dentro dela (senao o realce sai picado palavra por palavra). */
    nodes.push({ kind: "mark", key: `mark-${marks}`, markIndex: marks, parts });
    marks += 1;
  });

  const sweepStart = sweepDelay === null ? delay + words * step : sweepDelay;

  /* Estilo de entrada de uma palavra: o atraso cresce com o indice dela no
     paragrafo, entao a cascata atravessa o texto inteiro (destaques inclusive). */
  const wordStyle = (index) => ({
    "--bh-delay": `${delay + index * step}ms`,
    "--bh-duration": `${duration}ms`,
  });

  return (
    <Tag className={classes}>
      {nodes.map((node) => {
        if (node.kind === "space") return node.text;

        if (node.kind === "mark") {
          return (
            <span
              className="blur-highlight__mark"
              key={node.key}
              style={{
                "--bh-sweep-delay": `${sweepStart + node.markIndex * sweepStep}ms`,
                "--bh-sweep-duration": `${sweepDuration}ms`,
              }}
            >
              {node.parts.map((part) => {
                if (part.space) return part.space;

                return (
                  <span className="blur-highlight__word" key={`w-${part.index}`} style={wordStyle(part.index)}>
                    {part.text}
                  </span>
                );
              })}
            </span>
          );
        }

        return (
          <span className="blur-highlight__word" key={node.key} style={wordStyle(node.index)}>
            {node.text}
          </span>
        );
      })}
    </Tag>
  );
}

export default BlurHighlight;