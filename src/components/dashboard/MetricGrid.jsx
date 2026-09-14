import MetricCard from "../ui/MetricCard";
import "../../styles/pages/dashboard.css";

function MetricGrid({ items }) {
  return (
    <section className="metric-grid" aria-label="Indicadores">
      {items.map((item) => (
        <MetricCard
          key={item.id}
          label={item.label}
          value={item.value}
          tone={item.tone}
          icon={item.icon}
          delta={item.delta}
          hint={item.hint}
        />
      ))}
    </section>
  );
}

export default MetricGrid;

