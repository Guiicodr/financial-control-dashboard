import "../../styles/ui/primitives.css";

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon ? <span className="empty-icon" aria-hidden="true">{icon}</span> : null}
      {title ? <p className="empty-title">{title}</p> : null}
      {description ? <p className="empty-text">{description}</p> : null}
      {action || null}
    </div>
  );
}

export default EmptyState;

