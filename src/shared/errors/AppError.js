/**
 * Erro de aplicação: já traz uma mensagem pronta para exibir ao usuário.
 *
 * `kind` permite que a interface reaja de formas diferentes
 * (ex.: oferecer "tentar novamente" só quando faz sentido).
 */
export const ErrorKind = {
  VALIDATION: "validation", // dados inválidos enviados pelo usuário
  NETWORK: "network", // servidor fora do ar / sem internet / CORS
  TIMEOUT: "timeout", // servidor demorou demais para responder
  ACCESS: "access", // 401 / 403 — sem permissão
  NOT_FOUND: "not_found", // 404
  SERVER: "server", // 5xx
  CANCELED: "canceled", // requisição abortada (o usuário digitou de novo)
  UNKNOWN: "unknown",
};

export class AppError extends Error {
  constructor(message, kind = ErrorKind.UNKNOWN, options = {}) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.kind = kind;
    this.status = options.status ?? null;
    this.retryable = options.retryable ?? false;
  }
}
