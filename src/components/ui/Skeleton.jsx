import "../../styles/ui/primitives.css";

function Skeleton({ height = 16, width = "100%", radius, className }) {
  return (
    <span
      className={"skeleton" + (className ? " " + className : "")}
      style={{ height: height, width: width, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;

