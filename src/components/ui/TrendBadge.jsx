import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { formatSignedPercent } from "../../lib/format";
import "../../styles/ui/primitives.css";

/** Variacao percentual real; sem base de comparacao nao renderiza nada. */
function TrendBadge({ value, invert = false, hint }) {
  const { i18n } = useTranslation();
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;

  const number = Number(value);
  const zero = Math.abs(number) < 0.05;
  const good = invert ? number < 0 : number > 0;
  const tone = zero ? "neutral" : good ? "positive" : "negative";

  return (
    <span className={"trend trend--" + tone}>
      {!zero && (number > 0 ? <FaArrowTrendUp /> : <FaArrowTrendDown />)}
      <span>{formatSignedPercent(number, i18n.language)}</span>
      {hint ? <em>{hint}</em> : null}
    </span>
  );
}

export default TrendBadge;

