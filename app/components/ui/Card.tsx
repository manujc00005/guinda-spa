import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  const hoverClass = hover ? "hover:shadow-[var(--shadow-premium)]" : "";

  return <div className={`card ${hoverClass} transition-all ${className}`}>{children}</div>;
}
