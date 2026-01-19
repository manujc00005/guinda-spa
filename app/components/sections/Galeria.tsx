import { GALERIA_DATA } from "../../data/galeria";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";

export function Galeria() {
  return (
    <SectionShell id="galeria" bg="ivory">
      <SectionHeader {...GALERIA_DATA.header} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GALERIA_DATA.imagenes.map((imagen, index) => {
          // Primera imagen es destacada (2x2)
          const isDestacada = index === 0;
          const className = isDestacada ? "col-span-2 row-span-2" : "";

          return (
            <div
              key={index}
              className={`aspect-square bg-stone-200 rounded-2xl overflow-hidden ${className}`}
            >
              <img
                src={imagen.src}
                alt={imagen.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
