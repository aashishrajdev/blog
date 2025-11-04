import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  padding?: string;
  maxWidth?: number | string;
  margin?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

export default function GlassCard({
  children,
  padding = "40px",
  maxWidth,
  margin,
  style = {},
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={hover ? "glass-card" : "glass-effect"}
      style={{
        padding,
        maxWidth,
        margin,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
