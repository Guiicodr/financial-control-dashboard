/* ==========================================================================
   Finanly - Destaques de texto (Blur Highlight)
   Descobre, dentro de um texto, os trechos que devem ser destacados.
   A busca nao diferencia maiusculas nem acentos: "suba de nivel" encontra
   "suba de nível" no texto e vice-versa.
   ========================================================================== */

/* Acentos que o NFD separa da letra base (agudo, til, cedilha, trema...). */
const DIACRITICS = /[\u0300-\u036f]/;

/**
 * Dobra um texto para comparacao: minusculas e sem acentos, guardando de qual
 * caractere original veio cada letra. O mapa e necessario porque o NFD muda o
 * comprimento da string (o "í" vira duas unidades), o que desalinharia os
 * indices usados para cortar o texto original.
 */
function foldText(text) {
  const chars = Array.from(text);
  const origin = [];
  let folded = "";

  chars.forEach((char, index) => {
    const base = char
      .normalize("NFD")
      .split("")
      .filter((part) => !DIACRITICS.test(part))
      .join("")
      .toLowerCase();

    Array.from(base || char.toLowerCase()).forEach((letter) => {
      folded += letter;
      origin.push(index);
    });
  });

  return { chars, folded, origin };
}

/**
 * Posicoes dos trechos a destacar, em ordem de leitura e sem sobreposicao.
 * Em caso de empate quem aparece antes no texto fica com o destaque (e, se
 * comecarem no mesmo ponto, o trecho mais longo).
 */
function findRanges(text, phrases) {
  const { folded, origin } = foldText(text);
  const ranges = [];

  phrases.forEach((phrase, order) => {
    const needle = foldText(phrase).folded;
    if (!needle) return;

    let from = 0;
    for (;;) {
      const at = folded.indexOf(needle, from);
      if (at === -1) break;

      ranges.push({ order, start: origin[at], end: origin[at + needle.length - 1] + 1 });
      from = at + needle.length;
    }
  });

  ranges.sort((a, b) => a.start - b.start || b.end - a.end || a.order - b.order);

  let cursor = 0;
  return ranges.filter((range) => {
    if (range.start < cursor) return false;
    cursor = range.end;
    return true;
  });
}

/**
 * Divide o texto em trechos marcados e nao marcados, na ordem em que aparecem.
 * Devolve [{ text, order }], com order = null nos trechos sem destaque; o
 * numero e o indice do trecho em `phrases`, usado para escalonar a varredura.
 */
export function splitHighlights(text, phrases) {
  const source = typeof text === "string" ? text : "";
  const wanted = Array.isArray(phrases) ? phrases.filter((phrase) => typeof phrase === "string") : [];
  const { chars } = foldText(source);
  const segments = [];
  let cursor = 0;

  findRanges(source, wanted).forEach((range) => {
    if (range.start > cursor) {
      segments.push({ text: chars.slice(cursor, range.start).join(""), order: null });
    }

    segments.push({ text: chars.slice(range.start, range.end).join(""), order: range.order });
    cursor = range.end;
  });

  if (cursor < chars.length) {
    segments.push({ text: chars.slice(cursor).join(""), order: null });
  }

  return segments;
}

export default splitHighlights;