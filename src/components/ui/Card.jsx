import "../../styles/ui/primitives.css";

/**
 * Card do design system.
 * tone: "hero" | "inset"
 * padding: "sm" | "md" | "lg" | "none"
 */
function Card({ children, className = "", tone, padding }) {
  const classes = ["card"];

  if (tone) classes.push("card--" + tone);
  if (padding) classes.push("card--pad-" + padding);
  if (className) classes.push(className);

  return (
    <div className={classes.join(" ")}>
      {children}
    </div>
  );
}

export default Card;