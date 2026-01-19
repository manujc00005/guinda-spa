import { SERVICIOS_DATA } from "../../data/servicios";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { PriceCard } from "../ui/PriceCard";

export function Servicios() {
  return (
    <SectionShell id="servicios" bg="ivory">
      <SectionHeader {...SERVICIOS_DATA.header} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICIOS_DATA.serviciosDestacados.map((servicio, index) => (
          <PriceCard key={index} servicio={servicio} />
        ))}
      </div>
    </SectionShell>
  );
}
