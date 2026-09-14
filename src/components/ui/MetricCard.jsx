import TrendBadge from "./TrendBadge";
import "../../styles/ui/primitives.css";

/** Indicador financeiro: label em caps, valor forte e variacao real. */
function MetricCard({ label, value, tone = "accent", icon, delta, hint }) {
  return (
    <article className={"metric metric--" + tone}>
      <header className="metric-head">
        <span className="metric-label">{label}</span>
        {icon ? <span className="metric-icon" aria-hidden="true">{icon}</span> : null}
      </header>
      <p className="metric-value">{value}</p>
      <footer className="metric-foot">
        <TrendBadge value={delta} hint={hint} />
      </footer>
    </article>
  );
}

export default MetricCard;

