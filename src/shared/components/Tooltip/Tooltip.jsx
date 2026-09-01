import { useId, useState } from "react";

import "./Tooltip.css";

/**
 * Dica de contexto (tooltip) acessível.
 *
 * Regras que este componente segue, e por quê:
 *
 * 1. Abre no hover E no foco. Quem navega por teclado nunca passa o mouse:
 *    se a dica só aparecesse no hover, ela não existiria para essa pessoa.
 * 2. Fecha com Esc, porque a dica pode cobrir o conteúdo de baixo.
 * 3. `role="tooltip"` + `aria-describedby`: é isso que faz o leitor de tela
 *    anunciar "Pesquisar, botão — <texto da dica>". Sem a ligação, o balão é
 *    só um texto solto na página.
 * 4. A dica é sempre um complemento. O que é essencial para usar o campo tem
 *    que estar visível (label, placeholder, mensagem de erro) — tooltip é
 *    reforço, nunca a única fonte da informação.
 *
 * O elemento envolvido precisa ser focável (`button`, `input`, `a`), senão a
 * regra 1 não funciona.
 *
 * @param {object} props
 * @param {string} props.text        Texto da dica. Curto: 1–2 frases.
 * @param {"top"|"bottom"} [props.position]  Lado em que o balão aparece.
 * @param {boolean} [props.showOnClick]  Também abrir no clique/toque. Use em
 *   gatilhos de ajuda (ⓘ); não use em botões que já fazem outra ação.
 * @param {React.ReactNode} props.children  O elemento que recebe a dica.
 */
export function Tooltip({
  text,
  position = "top",
  showOnClick = false,
  children,
}) {
  // useId gera um id único por instância: duas dicas na mesma tela não podem
  // compartilhar id, senão o aria-describedby aponta para a bolha errada.
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") hide();
  };

  return (
    // Os eventos ficam no container: onFocus/onBlur do React sobem do filho
    // (focusin/focusout), então o botão de dentro dispara os dois.
    <span
      className="tooltip"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={handleKeyDown}
      // Em tela de toque não existe hover; o toque é o único gatilho possível.
      onClick={showOnClick ? show : undefined}
    >
      <span className="tooltip__anchor" aria-describedby={tooltipId}>
        {children}
      </span>

      {/* A bolha fica sempre no DOM (escondida por opacity no CSS) para que o
          aria-describedby tenha o que ler mesmo com a dica fechada. */}
      <span
        id={tooltipId}
        role="tooltip"
        className={`tooltip__bubble tooltip__bubble--${position}`}
        data-visible={visible ? "true" : "false"}
      >
        {text}
      </span>
    </span>
  );
}
