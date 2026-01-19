import { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  bg?: "white" | "ivory" | "primary";
  children: ReactNode;
  className?: string;
}

const bgClasses = {
  white: "bg-white",
  ivory: "bg-(--color-ivory)",
  primary: "bg-(--color-text-primary)",
};

export function SectionShell({ id, bg = "white", children, className = "" }: SectionShellProps) {
  return (
    <section id={id} className={`py-24 md:py-32 ${bgClasses[bg]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
