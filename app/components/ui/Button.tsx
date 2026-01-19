import { CTAButton } from "../../types/common";

interface ButtonProps extends CTAButton {
  className?: string;
  fullWidth?: boolean;
}

export function Button({ label, href, variant = "primary", className = "", fullWidth = false }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-10 py-4 text-base transition-all";
  const widthClass = fullWidth ? "w-full" : "";

  const variantClasses = {
    primary: "btn-primary",
    outline: "btn-outline",
    glass: "px-10 py-4 text-base rounded-full font-medium border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20",
  };

  return (
    <a href={href} className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}>
      {label}
    </a>
  );
}
