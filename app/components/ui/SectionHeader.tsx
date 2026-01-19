import { SectionHeaderData } from "../../types/common";

interface SectionHeaderProps extends SectionHeaderData {
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  titulo,
  descripcion,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-(--color-primary) mb-4 font-medium">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-(--color-text-primary) mb-6 leading-tight">
        {titulo}
      </h2>
      {descripcion && (
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto">{descripcion}</p>
      )}
    </div>
  );
}
