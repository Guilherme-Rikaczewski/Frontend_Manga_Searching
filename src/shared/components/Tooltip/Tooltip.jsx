import { useId, useState } from "react";

import "./Tooltip.css";

/**
 * Dica de contexto acessível.
 *
 * Aparece no hover (mouse) e no foco (teclado), fecha com Esc, e é ligada ao
 * elemento filho por `aria-describedby` — então leitores de tela também leem
 * a dica, não só quem enxerga o balão.
 *
 * @param {{ text: string, position?: "top" | "bottom", children: React.ReactElement }} props
 */
export function Tooltip({ text, position = "top", children }) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") hide();
  };

  return (
    <span
      className="tooltip"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={handleKeyDown}
    >
      <span className="tooltip__anchor" aria-describedby={tooltipId}>
        {children}
      </span>

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
