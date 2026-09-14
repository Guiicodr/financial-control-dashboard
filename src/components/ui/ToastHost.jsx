import { useEffect, useRef, useState } from "react";
import { FaCircleCheck, FaCircleXmark, FaTriangleExclamation } from "react-icons/fa6";
import { subscribeToasts } from "../../lib/toast";
import "../../styles/ui/toast.css";

function toneIcon(tone) {
  if (tone === "danger") return <FaCircleXmark />;
  if (tone === "warning") return <FaTriangleExclamation />;
  return <FaCircleCheck />;
}

function ToastHost() {
  const [items, setItems] = useState([]);
  const nextId = useRef(1);

  useEffect(() => {
    return subscribeToasts((toast) => {
      const id = nextId.current++;
      setItems((current) => current.concat([{ id: id, message: toast.message, tone: toast.tone || "success" }]));
      setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 3600);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={"toast toast--" + item.tone}>
          <span className="toast-icon" aria-hidden="true">{toneIcon(item.tone)}</span>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastHost;

