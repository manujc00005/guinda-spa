"use client";

import { useState } from "react";
import { PreguntaFAQ } from "../../types/common";
import { Card } from "./Card";

interface AccordionProps {
  pregunta: PreguntaFAQ;
}

export function Accordion({ pregunta }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-6 cursor-pointer" hover={false}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-(--color-text-primary)">{pregunta.pregunta}</span>
        <span
          className={`text-2xl text-(--color-primary) transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen && (
        <p className="mt-4 text-(--color-text-secondary) text-sm leading-relaxed">{pregunta.respuesta}</p>
      )}
    </Card>
  );
}
