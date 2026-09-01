/**
 * Máscaras de entrada.
 *
 * Uma máscara NUNCA rejeita o que o usuário digitou: ela transforma o valor
 * para o formato aceito enquanto ele digita. Quem rejeita é a validação
 * (ver `shared/validation/searchValidation.js`).
 */

export const SEARCH_MAX_LENGTH = 60;

/** Caracteres aceitos em um título de mangá: letras (com acento), números,
 *  espaço e a pontuação usual de títulos. */
const SEARCH_FORBIDDEN_CHARS = /[^\p{L}\p{N} .,:'!?&+-]/gu;

/**
 * Máscara do campo de busca: remove caracteres não permitidos, evita espaços
 * repetidos e limita o tamanho.
 */
export function maskSearchText(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(SEARCH_FORBIDDEN_CHARS, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "")
    .slice(0, SEARCH_MAX_LENGTH);
}

/** Mantém apenas dígitos, limitado a `maxLength`. */
export function maskDigits(value, maxLength = Infinity) {
  if (typeof value !== "string") return "";

  return value.replace(/\D/g, "").slice(0, maxLength);
}

/** Máscara de ano: 4 dígitos (ex.: "1997"). */
export function maskYear(value) {
  return maskDigits(value, 4);
}
