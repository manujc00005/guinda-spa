import { TESTIMONIOS_DATA } from "../../data/testimonios";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { TestimonialCard } from "../ui/TestimonialCard";

export function Opiniones() {
  return (
    <SectionShell id="opiniones" bg="white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader {...TESTIMONIOS_DATA.header} />

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIOS_DATA.testimonios.map((testimonio, index) => (
            <TestimonialCard key={index} testimonio={testimonio} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
