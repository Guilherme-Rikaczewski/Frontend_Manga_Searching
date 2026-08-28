import api from "./api";
import { AppError, ErrorKind } from "../shared/errors/AppError";
import { normalizeHttpError } from "../shared/errors/normalizeHttpError";
import { validateSearchText } from "../shared/validation/searchValidation";

/**
 * Garante que a resposta tem o formato esperado (uma lista de mangás).
 * Um backend fora do contrato não pode quebrar a renderização.
 */
function parseSearchResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;

  throw new AppError(
    "O servidor devolveu uma resposta inesperada.",
    ErrorKind.SERVER,
    { retryable: true },
  );
}

/**
 * @param {string} searchText termo digitado pelo usuário
 * @param {{ signal?: AbortSignal }} [options] permite cancelar a requisição
 * @returns {Promise<Array>} lista de mangás
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
