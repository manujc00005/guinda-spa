export interface Testimonio {
  texto: string;
  autor: string;
  estrellas: 1 | 2 | 3 | 4 | 5;

  // opcionales (Google / futuro)
  fecha?: string;
  origen?: "google" | "cliente" | "otro";
}
