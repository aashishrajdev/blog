import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
  className = "",
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center rounded-md font-semibold text-sm transition-all duration-200 ${
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
  }`;

  const variantClasses: Record<string, string> = {
    primary: "bg-blue-600 text-white border border-blue-500 shadow-sm",
    danger: "bg-red-500 text-white border border-red-400 shadow-sm",
    secondary: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  const classes = `${baseClasses} ${
    variantClasses[variant] ?? variantClasses.primary
  } ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={style}
    >
      {children}
    </button>
  );
}
