import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

/**
 * Toast – Animated notification popup.
 *
 * Props:
 *   message  : string   – text to display
 *   type     : 'success' | 'error' | 'warning'  (default: 'success')
 *   duration : number   – ms before auto-dismiss  (default: 3500)
 *   onClose  : fn       – called when toast is dismissed
 */
const Toast = ({ message, type = "success", duration = 3500, onClose }) => {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), 350);
  }, [onClose]);

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const hideTimer = setTimeout(() => handleClose(), duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, handleClose]);

  const config = {
    success: {
      icon: <CheckCircle size={22} />,
      accent: "#3b7668",
      bg: "rgba(59,118,104,0.1)",
      border: "rgba(59,118,104,0.3)",
    },
    error: {
      icon: <XCircle size={22} />,
      accent: "#d9534f",
      bg: "rgba(217,83,79,0.08)",
      border: "rgba(217,83,79,0.28)",
    },
    warning: {
      icon: <AlertTriangle size={22} />,
      accent: "#e58f3b",
      bg: "rgba(229,143,59,0.09)",
      border: "rgba(229,143,59,0.3)",
    },
  };

  const c = config[type] ?? config.success;

  return (
    <>
      <div
        role="alert"
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          maxWidth: "360px",
          width: "calc(100vw - 3rem)",
          background: "white",
          borderRadius: "14px",
          border: `1.5px solid ${c.border}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
          transform: visible
            ? "translateX(0) scale(1)"
            : "translateX(110%) scale(0.95)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Accent bar on left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            background: c.accent,
            borderRadius: "14px 0 0 14px",
          }}
        />

        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            color: c.accent,
            background: c.bg,
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "0.25rem",
          }}
        >
          {c.icon}
        </div>

        {/* Message */}
        <p
          style={{
            flex: 1,
            margin: 0,
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#1a2e2a",
            lineHeight: 1.5,
            paddingTop: "0.25rem",
          }}
        >
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888",
            padding: "0.1rem",
            display: "flex",
            alignItems: "center",
            borderRadius: "6px",
            transition: "color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#333";
            e.currentTarget.style.background = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#888";
            e.currentTarget.style.background = "none";
          }}
          aria-label="Tutup notifikasi"
        >
          <X size={16} />
        </button>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "3px",
            background: c.accent,
            borderRadius: "0 0 14px 14px",
            opacity: 0.5,
            animation: `toastProgress ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </>
  );
};

export default Toast;
