import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={24} />,
    error: <AlertCircle size={24} />,
    info: <Info size={24} />,
  };

  return (
    <div className={`toast-notification toast-${toast.type}`}>
      <div className="toast-icon">{icons[toast.type] || icons.success}</div>

      <div className="toast-content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>

      <div className="toast-progress" />
    </div>
  );
}

export default Toast;
