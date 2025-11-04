import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontSize: 14,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow:
      "0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "rgba(0, 112, 243, 0.9)",
      color: "#fff",
      border: "1px solid rgba(0, 112, 243, 0.5)",
    },
    danger: {
      background: "rgba(255, 68, 68, 0.9)",
      color: "#fff",
      border: "1px solid rgba(255, 68, 68, 0.5)",
    },
    secondary: {
      background: "rgba(0, 112, 243, 0.15)",
      color: "#0070f3",
      border: "1px solid rgba(0, 112, 243, 0.3)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={disabled ? "" : "glass-button"}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
