/**
 * Encuesta de bienestar obligatoria. Las preguntas son las que exige el
 * programa, con su redacción original; no se reformulan.
 */
export const TIPOS_DOCUMENTO = [
  "Cédula de ciudadanía",
  "Cédula de extranjería",
  "Pasaporte",
  "Permiso especial de permanencia (PEP)",
  "Permiso por protección temporal (PPT)",
  "Otro",
] as const;

export const PREGUNTAS = [
  { clave: "lifeSatisfaction", texto: "¿Qué tan satisfecho se siente con lo que ha hecho en la vida hasta ahora?" },
  { clave: "dailyWorthwhile", texto: "¿Qué tan importantes son las cosas que hace a diario?" },
  { clave: "happyYesterday", texto: "¿Qué tan feliz estuvo ayer?" },
  { clave: "anxiousYesterday", texto: "¿Qué tan preocupado o ansioso estuvo ayer?" },
  { clave: "sadYesterday", texto: "¿Qué tan triste o deprimido estuvo ayer?" },
] as const;

export type ClavePregunta = (typeof PREGUNTAS)[number]["clave"];

export interface RespuestaEncuesta {
  documentType: string;
  documentNumber: string;
  fullName: string;
  scores: Record<ClavePregunta, number>;
}
