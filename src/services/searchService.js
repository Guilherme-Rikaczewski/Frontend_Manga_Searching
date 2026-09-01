import api from "./api";
import { AppError, ErrorKind } from "../shared/errors/AppError";
import { normalizeHttpError } from "../shared/errors/normalizeHttpError";
import { validateSearchText } from "../shared/validation/searchValidation";

/**
 * Garante que a resposta tem o formato esperado.
 * Um backend fora do contrato não pode quebrar a renderização.
 *
 * O contrato da API (GET /search/) é:
 * { manga, total_opcoes, preco_minimo, preco_medio,
 *   fontes_consultadas, fontes_com_falha, opcoes: [...] }
 *
 * @returns {{ options: Array, priceMin: number|null, priceAvg: number|null,
 *             failedSources: string[] }}
 */
function parseSearchResponse(data) {
  // Lista pura (ou `results`/`data`) cobre formatos alternativos da API.
  const options =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.opcoes) && data.opcoes) ||
    (Array.isArray(data?.results) && data.results) ||
    (Array.isArray(data?.data) && data.data) ||
    null;

  if (!options) {
    throw new AppError(
      "O servidor devolveu uma resposta inesperada.",
      ErrorKind.SERVER,
      { retryable: true },
    );
  }

  return {
    options,
    priceMin: data?.preco_minimo ?? null,
    priceAvg: data?.preco_medio ?? null,
    failedSources: Array.isArray(data?.fontes_com_falha)
      ? data.fontes_com_falha
      : [],
  };
}

/**
 * @param {string} searchText termo digitado pelo usuário
 * @param {{ signal?: AbortSignal }} [options] permite cancelar a requisição
 * @returns {Promise<{ options: Array, priceMin: number|null,
 *                     priceAvg: number|null, failedSources: string[] }>}
 * @throws {AppError} sempre um AppError com mensagem pronta para exibição
 */
export const searchManga = async (searchText, { signal } = {}) => {
  // Validação também aqui: o serviço não confia em quem o chama.
  const { valid, message, value } = validateSearchText(searchText);

  if (!valid) {
    throw new AppError(message, ErrorKind.VALIDATION);
  }

  try {
    const response = await api.get("/search/", {
      params: {
        search_expression: value,
        filters: [],
      },
      signal,
    });

    return parseSearchResponse(response.data);
  } catch (error) {
    // O interceptor já normaliza; isto cobre erros lançados aqui dentro.
    throw normalizeHttpError(error);
  }
};
