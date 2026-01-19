import { NavItem } from "../../types/navigation";

interface NavLinkProps extends NavItem {
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, label, className = "", onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-sm font-medium text-(--color-text-secondary) hover:text-(--color-primary) transition-colors whitespace-nowrap ${className}`}
    >
      {label}
    </a>
  );
}
