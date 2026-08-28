import axios from "axios";

import { AppError, ErrorKind } from "./AppError";

/** Tenta extrair uma mensagem enviada pelo backend, em vez de um texto genérico. */
function messageFromResponse(data) {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return null;

  // FastAPI usa `detail`; outros formatos comuns: `message` / `error`.
  const detail = data.detail ?? data.message ?? data.error;

  if (typeof detail === "string" && detail.trim()) return detail.trim();

  // FastAPI/Pydantic: `detail` é uma lista de erros de validação.
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first && typeof first.msg === "string") return first.msg;
  }

  return null;
}

/**
 * Converte qualquer erro (axios, rede, cancelamento, bug de código) em um
 * `AppError` com mensagem amigável. É o único lugar do projeto que precisa
 * conhecer os detalhes do axios.
 */
export function normalizeHttpError(error) {
  if (error instanceof AppError) return error;

  if (axios.isCancel?.(error) || error?.code === "ERR_CANCELED") {
    return new AppError("Pesquisa cancelada.", ErrorKind.CANCELED, {
      cause: error,
    });
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return new AppError(
      "O servidor demorou demais para responder. Tente novamente.",
      ErrorKind.TIMEOUT,
      { cause: error, retryable: true },
    );
  }

  // Requisição saiu, mas nenhuma resposta chegou: servidor fora do ar,
  // sem internet, DNS ou bloqueio de CORS.
  if (error?.request && !error?.response) {
    return new AppError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      ErrorKind.NETWORK,
      { cause: error, retryable: true },
    );
  }

  const status = error?.response?.status ?? null;
  const serverMessage = messageFromResponse(error?.response?.data);

  if (status === 400 || status === 422) {
    return new AppError(
      serverMessage ?? "Os dados da pesquisa são inválidos.",
      ErrorKind.VALIDATION,
      { cause: error, status },
    );
  }

  if (status === 401 || status === 403) {
    return new AppError(
      serverMessage ?? "Você não tem permissão para realizar esta pesquisa.",
      ErrorKind.ACCESS,
      { cause: error, status },
    );
  }

  if (status === 404) {
    return new AppError(
      serverMessage ?? "O serviço de pesquisa não foi encontrado.",
      ErrorKind.NOT_FOUND,
      { cause: error, status },
    );
  }

  if (status === 429) {
    return new AppError(
      "Muitas pesquisas em pouco tempo. Aguarde alguns instantes.",
      ErrorKind.ACCESS,
      { cause: error, status, retryable: true },
    );
  }

  if (status !== null && status >= 500) {
    return new AppError(
      "O servidor falhou ao processar a pesquisa. Tente novamente em instantes.",
      ErrorKind.SERVER,
      { cause: error, status, retryable: true },
    );
  }

  return new AppError(
    "Ocorreu um erro inesperado ao pesquisar. Tente novamente.",
    ErrorKind.UNKNOWN,
    { cause: error, status },
  );
}
