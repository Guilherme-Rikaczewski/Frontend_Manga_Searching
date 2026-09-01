import { SEARCH_MAX_LENGTH } from "../utils/masks";

export const SEARCH_MIN_LENGTH = 2;

/**
 * Valida o termo de busca já mascarado.
 *
 * @returns {{ valid: boolean, message: string | null, value: string }}
 *   `value` é o termo pronto para ir à API (sem espaços nas pontas).
 */
export function validateSearchText(rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";

  if (value.length === 0) {
    return {
      valid: false,
      message: "Digite o nome de um mangá para pesquisar.",
      value,
    };
  }

  if (value.length < SEARCH_MIN_LENGTH) {
    return {
      valid: false,
      message: `Use pelo menos ${SEARCH_MIN_LENGTH} caracteres na pesquisa.`,
      value,
    };
  }

  if (value.length > SEARCH_MAX_LENGTH) {
    return {
      valid: false,
      message: `A pesquisa deve ter no máximo ${SEARCH_MAX_LENGTH} caracteres.`,
      value,
    };
  }

  // Um termo só de pontuação (ex.: "..." ou "!!") não identifica nenhum mangá.
  if (!/[\p{L}\p{N}]/u.test(value)) {
    return {
      valid: false,
      message: "A pesquisa precisa conter letras ou números.",
      value,
    };
  }

  return { valid: true, message: null, value };
}
