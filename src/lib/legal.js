/**
 * Dados dos documentos legais (Termos de Uso + Aviso de Privacidade).
 *
 * Fonte única: o TEXTO dos documentos vive no i18n (src/locales) e os dados do
 * controlador, a versão e o canal do titular vivem aqui. Ao publicar uma versão
 * nova dos textos, suba LEGAL_VERSION: o cadastro envia essa versão para a API,
 * que a grava junto do aceite (LGPD art. 8, §1º) — é o que permite demonstrar
 * depois QUAL documento o titular aceitou e QUANDO.
 *
 * PENDENTE ANTES DE PUBLICAR: trocar os campos entre [ ] pelos dados reais.
 * A LGPD (art. 9, I) exige que o titular saiba quem é o controlador — o rodapé
 * dizia apenas "Finanly Inc.", que não identifica ninguém de verdade.
 */
export const LEGAL_VERSION = "2026-09-1";
export const LEGAL_UPDATED_AT = "21/09/2026";

export const CONTROLADOR = {
  nome: "[RAZÃO SOCIAL OU NOME COMPLETO]",
  documento: "[CNPJ ou CPF]",
  endereco: "[CIDADE/UF]",
  foro: "[COMARCA/UF]",
};

/**
 * Encarregado pelo tratamento de dados (LGPD art. 41 e Res. CD/ANPD nº 18/2024).
 * Agente de pequeno porte pode não designar encarregado, mas precisa manter um
 * canal de comunicação com o titular — este e-mail é esse canal.
 */
export const ENCARREGADO = {
  nome: "[NOME DO ENCARREGADO]",
  email: "privacidade@[SEU-DOMINIO]",
};

/** Prazo que a API se compromete a respeitar para responder ao titular. */
export const PRAZO_RESPOSTA_DIAS = 15;

/** Operadores que tratam dados em nome do Finanly (para transparência, art. 9, VII). */
export const OPERADORES = [
  "Railway — hospedagem da API e do banco de dados",
  "Vercel — hospedagem do site",
  "Meta (WhatsApp Cloud API) / Twilio — troca de mensagens do bot",
];
