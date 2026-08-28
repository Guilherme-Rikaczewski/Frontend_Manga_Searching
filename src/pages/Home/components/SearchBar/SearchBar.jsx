import { useEffect, useId, useRef, useState } from "react";

import "./SearchBar.css";
import { searchManga } from "../../../../services/searchService";
import { ErrorKind } from "../../../../shared/errors/AppError";
import { Tooltip } from "../../../../shared/components/Tooltip/Tooltip";
import { maskSearchText, SEARCH_MAX_LENGTH } from "../../../../shared/utils/masks";
import { validateSearchText } from "../../../../shared/validation/searchValidation";

const SEARCH_HINT =
  `Digite o título do mangá (mín. 2 e máx. ${SEARCH_MAX_LENGTH} caracteres). ` +
  "Acentos são aceitos; símbolos como @ # $ são removidos automaticamente.";

export function SearchBar() {
  const inputId = useId();
  const feedbackId = useId();

  const [term, setTerm] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cancela a busca anterior quando outra começa ou o componente desmonta,
  // evitando atualizar o estado de um componente que já saiu da tela.
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleChange = (event) => {
    setTerm(maskSearchText(event.target.value));
    setError(null);
    setStatus(null);
  };

  // Valida ao sair do campo: o usuário recebe o aviso antes de tentar buscar.
  const handleBlur = () => {
    if (term.trim().length === 0) return;

    const { valid, message } = validateSearchText(term);
    setError(valid ? null : message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { valid, message, value } = validateSearchText(term);

    if (!valid) {
      setError(message);
      setStatus(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const results = await searchManga(value, { signal: controller.signal });

      setStatus(
        results.length === 0
          ? `Nenhum mangá encontrado para "${value}".`
          : `${results.length} mangá(s) encontrado(s) para "${value}".`,
      );
    } catch (appError) {
      // Busca abortada por outra mais recente: não é erro para o usuário.
      if (appError.kind === ErrorKind.CANCELED) return;

      console.error(appError);
      setError(
        appError.retryable
          ? `${appError.message} (tente novamente)`
          : appError.message,
      );
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  };

  const hasError = Boolean(error);

  return (
    <div className="search-bar-field">
      <form className="search-bar" role="search" onSubmit={handleSubmit} noValidate>
        <label className="search-bar__label" htmlFor={inputId}>
          Pesquise pelo seu mangá
        </label>

        <input
          id={inputId}
          className="search-bar__input"
          type="search"
          placeholder="Pesquise pelo seu mangá"
          autoComplete="off"
          value={term}
          maxLength={SEARCH_MAX_LENGTH}
          disabled={loading}
          aria-invalid={hasError}
          aria-describedby={feedbackId}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <Tooltip text={SEARCH_HINT} position="bottom">
          <button
            className="search-bar__button"
            type="submit"
            aria-label="Pesquisar"
            disabled={loading}
          >
            {loading ? (
              <span className="search-bar__spinner" aria-hidden="true" />
            ) : (
              <svg
                aria-hidden="true"
                width="27"
                height="27"
                viewBox="0 0 43 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35.1167 37.625L23.8292 26.3375C22.9333 27.0542 21.9031 27.6215 20.7385 28.0396C19.574 28.4576 18.3347 28.6667 17.0208 28.6667C13.766 28.6667 11.0113 27.5394 8.75677 25.2849C6.50226 23.0304 5.375 20.2757 5.375 17.0208C5.375 13.766 6.50226 11.0113 8.75677 8.75677C11.0113 6.50226 13.766 5.375 17.0208 5.375C20.2757 5.375 23.0304 6.50226 25.2849 8.75677C27.5394 11.0113 28.6667 13.766 28.6667 17.0208C28.6667 18.3347 28.4576 19.574 28.0396 20.7385C27.6215 21.9031 27.0542 22.9333 26.3375 23.8292L37.625 35.1167L35.1167 37.625ZM17.0208 25.0833C19.2604 25.0833 21.1641 24.2995 22.7318 22.7318C24.2995 21.1641 25.0833 19.2604 25.0833 17.0208C25.0833 14.7812 24.2995 12.8776 22.7318 11.3099C21.1641 9.74219 19.2604 8.95833 17.0208 8.95833C14.7812 8.95833 12.8776 9.74219 11.3099 11.3099C9.74219 12.8776 8.95833 14.7812 8.95833 17.0208C8.95833 19.2604 9.74219 21.1641 11.3099 22.7318C12.8776 24.2995 14.7812 25.0833 17.0208 25.0833Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </Tooltip>
      </form>

      {/* aria-live: leitores de tela anunciam erro e resultado sem mover o foco. */}
      <p
        id={feedbackId}
        className={`search-bar__feedback${hasError ? " search-bar__feedback--error" : ""}`}
        role={hasError ? "alert" : "status"}
        aria-live="polite"
      >
        {loading ? "Pesquisando..." : (error ?? status ?? "")}
      </p>
    </div>
  );
}
