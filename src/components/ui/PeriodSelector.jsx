import "../../styles/ui/primitives.css";

function PeriodSelector({ options, value, onChange, label }) {
  return (
    <div className="period-selector" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={active ? "is-active" : ""}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default PeriodSelector;

