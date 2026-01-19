/**
 * BOTÓN DE ICONO SOCIAL
 *
 * Componente reutilizable para iconos de redes sociales en el header
 * Diseño discreto y elegante con hover effect sutil
 */

import { ComponentType } from "react";

interface SocialIconButtonProps {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  ariaLabel: string;
  highlight?: boolean; // Para destacar WhatsApp
}

export function SocialIconButton({ href, Icon, ariaLabel, highlight = false }: SocialIconButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-200
        ${
          highlight
            ? "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) hover:scale-105"
            : "bg-transparent text-(--color-text-secondary) hover:text-(--color-primary) hover:scale-105"
        }
      `}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
